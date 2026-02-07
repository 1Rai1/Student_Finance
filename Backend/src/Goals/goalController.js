const {Goals} = require('../../models')

exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goals.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.createGoals = async (req,res) => {
    try{
        const {userId ,title, targetAmount, currentAmount, deadline, category} = req.body

        const existingGoal = await Goals.findOne({title})
        if(existingGoal){
            return res.status(400).json({message: "Goal already exist"})
        }

        const goal = await Goals.create({
            userId,
            title,
            targetAmount,
            currentAmount,
            deadline,
            category,
        })
        res.status(201).json({success: true, message: goal})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

    exports.deleteGoals = async (req,res) => {
        try{
        const existingGoal = await Goals.findByIdAndDelete(req.params.id)

        if(!existingGoal){
            return res.status(404).json({message:"Goal does not exist"})
        }
        res.status(200).json({message: "Goal deleted Successfully"})
    }
        catch(error){
            res.status(500).json({message: error.message})
        }
    }

    exports.updateGoals = async (req,res) => {
        try{
            const {title, targetAmount, currentAmount, deadline, category} = req.body
            
            const goals = await Goals.findByIdAndUpdate(req.params.id,
                {userId ,title, targetAmount, currentAmount, deadline, category},
                {new:true, runValidators: true}
            )

            if(!goals){
                return res.status(404).json({message:"Goal not found"})
            }

            res.status(200).json({data: goals})
       
        }

        catch (error){
            res.status(500).json({message: error.message})
        }
    }