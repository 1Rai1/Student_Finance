const {db} = require('../../firebase/firebase-admin')
const cloudinary = require('../Middleware/cloudinary')
const sharp = require('sharp')
const discountCollection = db.collection('discounts');
const userCollection = db.collection('users');
const interactionsCollection = db.collection('post-interactions');
const messagesCollection = db.collection('post-messages')

//create discount
const createDiscount = async(req, res) => {
    try{
        const {userId} = req.params
        const {
            title,
            description,
            location
        } = req.body

        //check information
        if(!title || !description || !location){  
            return res.status(400).json({
                success: false,
                message: "Incomplete Information"
            })
        }

        const userDoc = await userCollection.doc(userId).get()
        //check user
        if(!userDoc.exists){
            return res.status(404).json({
               success: false,
               message: "No User Found" 
            })
        }
        
        let imageUrl = ''

        //files
        if(req.file){
            try {
                let processedImage = req.file.buffer;
                // Try to use sharp if available, otherwise skip processing
                try {
                    const sharp = require('sharp');
                    processedImage = await sharp(req.file.buffer)
                        .resize(1200, 1200, {
                            fit: 'inside',
                            withoutEnlargement: true
                        })
                        .jpeg({quality: 90})
                        .toBuffer();
                } catch (sharpErr) {
                    console.warn('Sharp processing skipped:', sharpErr.message);
                    // proceed with original buffer
                }

                const filename = `discount-posts/${userId}-${Date.now()}.jpg`;
                const file = bucket.file(filename);  

                await file.save(processedImage, {
                    metadata: {
                        contentType: req.file.mimetype || 'image/jpeg'
                    }
                })

                await file.makePublic()
                imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
                console.log('Image uploaded successfully:', imageUrl);
            } catch (uploadErr) {
                console.error('Image upload failed:', uploadErr);
                // Continue without image (post will be created but no image)
                imageUrl = '';
            }
        }
        
        //create the data
        const postData = {
            userId,
            title,
            description,
            location: location || '',
            imageUrl,
            likes: 0,
            saves: 0,
            messages: 0,
            votes: {
                real: 0,
                fake: 0,
                total: 0
            },
            verificationStatus: 'unverified',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        
        const docRef = await discountCollection.add(postData)

        const userData = userDoc.data()

        res.status(201).json({
            success: true,
            message: "Discount Created Successfully",
            data: {
                id: docRef.id, 
                ...postData,
                author: {
                    id: userId,
                    name: userData.name,
                    email: userData.email
                }
            }
        })
    }
    catch(error){
        console.error('CreateDiscount error:', error);
        res.status(500).json({
            success: false,
            message: "Error Creating Discount Post",
            error: error.message
        })
    }
}

// Filter/Search posts
const filterPost = async (req, res) => {
    try {
        const { userId, title, location } = req.query; // ← Use query params, not body

        // Check if at least one search parameter provided
        if (!userId && !title && !location) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one search parameter: userId, title, or location"
            });
        }

        let posts = [];

        // Search by userId
        if (userId) {
            const userDoc = await userCollection.doc(userId).get();
            if (!userDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: "User Not Found"
                });
            }

            const snapshot = await discountCollection
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            snapshot.forEach(doc => {
                posts.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
        }
        // Search by title 
        else if (title) {
            // Get all posts and filter in memory (Firestore doesn't support partial text search)
            const snapshot = await discountCollection
                .orderBy('createdAt', 'desc')
                .get();

            snapshot.forEach(doc => {
                const postData = doc.data();
                // Case-insensitive partial match
                if (postData.title && postData.title.toLowerCase().includes(title.toLowerCase())) {
                    posts.push({
                        id: doc.id,
                        ...postData
                    });
                }
            });
        }
        else if (location) {
            const snapshot = await discountCollection
                .orderBy('createdAt', 'desc')
                .get();

            snapshot.forEach(doc => {
                const postData = doc.data();
                // Case-insensitive partial match
                if (postData.location && postData.location.toLowerCase().includes(location.toLowerCase())) {
                    posts.push({
                        id: doc.id,
                        ...postData
                    });
                }
            });
        }
        // No results found
        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No posts found matching your search"
            });
        }

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Filtering Posts",
            error: error.message
        });
    }
}

//get all the discount post
const getAllDiscount = async(req, res) => {
    try{
        const snapshot = await discountCollection
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get()

        //check if empty
        if(snapshot.empty){
            return res.status(200).json({
                success: true,
                data: []
            })
        }

        const posts = []
        for (const doc of snapshot.docs){
            const postData = doc.data()

            //get author 
            const userDoc = await userCollection.doc(postData.userId).get()
            const userData = userDoc.exists ? userDoc.data() : {}

            //get data
            posts.push({
                id: doc.id,
                title: postData.title,
                description: postData.description,
                location: postData.location,
                imageUrl: postData.imageUrl,
                likes: postData.likes,
                saves: postData.saves,
                messages: postData.messages,
                votes: postData.votes,
                verificationStatus: postData.verificationStatus,
                createdAt: postData.createdAt,
                author: {
                    id: postData.userId,
                    name: userData.name || 'Unknown User', 
                    email: userData.email || ''  
                }
            })
        }
        
        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error Fetching Discount Post",
            error: error.message
        })
    }
}

//get discount by id
const getDiscountById = async(req, res) => {
    try{
        const {postId} = req.params
        const postDoc = await discountCollection.doc(postId).get()

        //check if post exist
        if(!postDoc.exists){
            return res.status(404).json({
                success: false,
                message: "No Post Found"
            })
        }
        
        const postData = postDoc.data()
        
        //get author info
        const userDoc = await userCollection.doc(postData.userId).get()
        const userData = userDoc.exists ? userDoc.data() : {}

        res.status(200).json({
            success: true,
            data: {
                id: postDoc.id,
                ...postData,
                author: {
                    id: postData.userId,
                    name: userData.name || 'Unknown',
                    email: userData.email || ''
                }
            }
        })       
    }   
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error Fetching Discount By Id",
            error: error.message
        })
    }
}

//like post
const likePost = async(req, res) => {
    try{
        const {postId} = req.params
        const {userId} = req.body

        //check post
        const postDoc = await discountCollection.doc(postId).get()
        if(!postDoc.exists){
            return res.status(404).json({
                success: false,
                message: "No Post Found"
            })
        }

        //CHECK if already liked
        const existingLike = await interactionsCollection
            .where('postId', '==', postId)
            .where('userId', '==', userId)
            .where('type', '==', 'like')  
            .limit(1)
            .get()

        if(!existingLike.empty){
            //Unlike that post
            existingLike.forEach(async (doc) => {
                await interactionsCollection.doc(doc.id).delete()  
            })
            
            const currentLikes = postDoc.data().likes || 0  
            await discountCollection.doc(postId).update({
                likes: Math.max(0, currentLikes - 1)
            })

            return res.status(200).json({
                success: true,
                message: "Post Unliked",
                liked: false,
                likes: Math.max(0, currentLikes - 1)
            })
        } else {
            //LIKE
            await interactionsCollection.add({
                postId,
                userId,
                type: 'like',
                createdAt: new Date().toISOString()  
            })

            const currentLikes = postDoc.data().likes || 0    
            await discountCollection.doc(postId).update({ 
                likes: currentLikes + 1
            })
            
            return res.status(200).json({
                success: true,
                message: "Post Liked",
                liked: true,
                likes: currentLikes + 1
            })
        }
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error Liking Post",
            error: error.message
        })
    }
}

//save Post
const savePost = async(req, res) => {
    try{
        const {postId} = req.params
        const {userId} = req.body

        //check post
        const postDoc = await discountCollection.doc(postId).get()
        if(!postDoc.exists){
            return res.status(404).json({
                success: false,
                message: "No Post Found"
            })
        }
        
        //check user
        const userDoc = await userCollection.doc(userId).get()  
        if(!userDoc.exists){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        //check if user already saved
        const existingSave = await interactionsCollection
            .where('userId', '==', userId)
            .where('postId', '==', postId)
            .where('type', '==', 'save') 
            .limit(1)
            .get()

        if(!existingSave.empty){
            //unsave
            existingSave.forEach(async (doc) => {
                await interactionsCollection.doc(doc.id).delete()  
            })

            const currentSaves = postDoc.data().saves || 0
            await discountCollection.doc(postId).update({
                saves: Math.max(0, currentSaves - 1)
            })

            return res.status(200).json({
                success: true,
                message: "Post Unsaved",
                saved: false,
                saves: Math.max(0, currentSaves - 1)
            })
        }
        else {
            //save
            await interactionsCollection.add({
                postId,
                userId,
                type: 'save',
                createdAt: new Date().toISOString()
            })

            const currentSaves = postDoc.data().saves || 0
            await discountCollection.doc(postId).update({  
                saves: currentSaves + 1
            })

            return res.status(200).json({
                success: true,
                message: "Post Saved",
                saved: true,
                saves: currentSaves + 1
            })
        }
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error Saving Post",
            error: error.message
        })
    }
}

//add vote
const voteOnPost = async(req, res) => {
    try{
        const {postId} = req.params
        const {userId, vote} = req.body

        if(!vote || (vote !== 'real' && vote !== 'fake')){  
            return res.status(400).json({
                success: false,
                message: "Invalid Vote"
            })
        }

        //check if post exists
        const postDoc = await discountCollection.doc(postId).get()
        if(!postDoc.exists){
            return res.status(404).json({
                success: false,
                message: "Post Not Found"
            })
        }

        //check existing vote
        const existingVote = await interactionsCollection
            .where('postId', '==', postId)
            .where('userId', '==', userId)
            .where('type', '==', 'vote')
            .limit(1)
            .get()

        const postData = postDoc.data()
        const currentVotes = postData.votes || {real: 0, fake: 0, total: 0} 

        if(!existingVote.empty){  
            //update vote
            let oldVote
            let voteDocId

            existingVote.forEach(doc => {
                oldVote = doc.data().voteValue
                voteDocId = doc.id
            })

            //if same vote do nothing
            if(oldVote === vote){  
                return res.status(200).json({
                    success: true,
                    message: "Vote Already Registered",
                    votes: currentVotes
                })
            }

            await interactionsCollection.doc(voteDocId).update({
                voteValue: vote,
                updatedAt: new Date().toISOString() 
            })

            const newVotes = {
                real: oldVote === 'real' ? currentVotes.real - 1 : currentVotes.real,
                fake: oldVote === 'fake' ? currentVotes.fake - 1 : currentVotes.fake,
                total: currentVotes.total
            }

            newVotes[vote] += 1
            
            await discountCollection.doc(postId).update({
                votes: newVotes,
                verificationStatus: calculateVerificationStatus(newVotes),
                updatedAt: new Date().toISOString()  
            })

            return res.status(200).json({
                success: true,
                message: "Vote Updated",
                votes: newVotes,
                verificationStatus: calculateVerificationStatus(newVotes)
            })
        } else {
            //new vote
            await interactionsCollection.add({
                postId,
                userId,
                type: 'vote',
                voteValue: vote,
                createdAt: new Date().toISOString()
            })

            const newVotes = {
                real: vote === 'real' ? currentVotes.real + 1 : currentVotes.real,
                fake: vote === 'fake' ? currentVotes.fake + 1 : currentVotes.fake,
                total: currentVotes.total + 1  
            }

            await discountCollection.doc(postId).update({ 
                votes: newVotes,
                verificationStatus: calculateVerificationStatus(newVotes),
                updatedAt: new Date().toISOString()  
            })

            return res.status(200).json({
                success: true,
                message: "Vote Recorded",
                votes: newVotes,
                verificationStatus: calculateVerificationStatus(newVotes)
            })
        }
    }
    catch(error){
        res.status(500).json({
            success: false,  
            message: "Error Voting On Post",
            error: error.message
        })
    }
}

//add message
const addMessage = async(req, res) => {
    try{
        const {postId} = req.params
        const {userId, message} = req.body 

        //validate message
        if(!message || message.trim() === ''){
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            })
        }

        //check post 
        const postDoc = await discountCollection.doc(postId).get()
        if(!postDoc.exists){
            return res.status(404).json({
                success: false,
                message: "No Post Found"
            })
        }
        
        //check user
        const userDoc = await userCollection.doc(userId).get()
        if(!userDoc.exists){
            return res.status(404).json({
                success: false,
                message: "No User Found"
            })
        }

        const userData = userDoc.data()

        //addMessage 
        const messageData = {
            postId,
            userId,
            userName: userData.name,
            userAvatar: userData.avatarUrl || '',
            message: message.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()  
        }

        const docRef = await messagesCollection.add(messageData)

        //update message count 
        const currentMessages = postDoc.data().messages || 0  
        await discountCollection.doc(postId).update({
            messages: currentMessages + 1
        })

        res.status(201).json({
            success: true,
            message: "Message Added",
            data: {
                id: docRef.id,
                ...messageData
            }
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error Adding Message",
            error: error.message
        })
    }
}

//get the message for post
const getPostMessages = async(req, res) => {
    try{
        const {postId} = req.params
        
        const snapshot = await messagesCollection
            .where('postId', '==', postId)
            .orderBy('createdAt', 'asc')
            .get()

        const messages = []  
        snapshot.forEach(doc => {
            messages.push({
                id: doc.id,
                ...doc.data()
            })
        })
        
        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error Getting Post Messages",
            error: error.message
        })
    }
}

//delete post
const deleteDiscount = async(req, res) => {
    try{
        const {postId} = req.params

        //check doc
        const postDoc = await discountCollection.doc(postId).get()
        if(!postDoc.exists){
            return res.status(404).json({
                success: false,
                message: "Post Not Found"
            })
        }
        
        //delete image if applicable
        const imageUrl = postDoc.data().imageUrl
        if(imageUrl){
            try{
                const urlParts = imageUrl.split('/')
                const filename = urlParts[urlParts.length - 1]
                await bucket.file(`discount-posts/${decodeURIComponent(filename)}`).delete()  
            }
            catch(error){
                console.error('Error Deleting Image:', error)
            }
        }

        //deleting all interactions
        const interactions = await interactionsCollection
            .where('postId', '==', postId)
            .get()

        interactions.forEach(async (doc) => {
            await interactionsCollection.doc(doc.id).delete()  
        })

        //delete all messages
        const messages = await messagesCollection
            .where('postId', '==', postId)
            .get()

        messages.forEach(async (doc) => {
            await messagesCollection.doc(doc.id).delete()
        })

        //delete the post
        await discountCollection.doc(postId).delete()

        res.status(200).json({
            success: true,
            message: "Post Deleted Successfully"
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error Deleting Post",
            error: error.message
        })
    }
}

//helper to calculate verification status
function calculateVerificationStatus(votes){
    if(votes.total < 5){
        return 'unverified'
    }

    const realPercentage = (votes.real / votes.total) * 100
    
    if(realPercentage >= 70){
        return 'verified'
    } else if(realPercentage <= 30){
        return 'fake'
    } else {
        return 'unverified'
    }
}

module.exports = {
    createDiscount,
    getAllDiscount,
    getDiscountById,
    likePost,
    savePost,
    voteOnPost,
    addMessage,
    getPostMessages,
    deleteDiscount,
    filterPost
}