//screens/discounts.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, Image,
  Modal, KeyboardAvoidingView, Platform, ActivityIndicator,
  ScrollView, Alert, RefreshControl,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDiscounts } from '../hooks/useDiscounts';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import {
  COLORS, SPACING, LAYOUT, BUTTON, CARD, TEXT,
  INPUT_STYLES, BADGE, AVATAR, MODAL, CHIP, UTILS, TYPOGRAPHY,
} from '../styles/global';

//format date
const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });

//get initials
const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

//status badge
function StatusBadge({ status }) {
  const map = {
    verified:   [BADGE.verified,   BADGE.verifiedText,   'Verified'],
    fake:       [BADGE.fake,       BADGE.fakeText,       'Fake'],
    unverified: [BADGE.unverified, BADGE.unverifiedText, 'Unverified'],
  };
  const [bg, txt, label] = map[status] || map.unverified;
  return <View style={bg}><Text style={txt}>{label}</Text></View>;
}

//comment sheet modal
function CommentSheet({ post, visible, onClose }) {
  const { getMessages, addMessage } = useDiscounts();
  //state
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  //load messages
  const load = useCallback(async () => {
    if (post) setMsgs(await getMessages(post.id));
  }, [post]);

  React.useEffect(() => { if (visible) load(); }, [visible]);

  //send message
  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const res = await addMessage(post.id, text.trim());
    if (res.success) { setMsgs(prev => [...prev, res.data]); setText(''); }
    setSending(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={MODAL.overlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={UTILS.bottomSheet}>
        <View style={MODAL.discountModal}>
          <View style={UTILS.dragHandle} />
          <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.md }]}>Comments</Text>
          <ScrollView style={{ maxHeight: 320 }} keyboardShouldPersistTaps="handled">
            {msgs.length === 0 && (
              <Text style={[TEXT.emptyState, { paddingTop: SPACING.md }]}>No comments yet.</Text>
            )}
            {msgs.map(m => (
              <View key={m.id} style={[UTILS.row, { marginBottom: SPACING.sm, alignItems: 'flex-start' }]}>
                <View style={AVATAR.sm}><Text style={AVATAR.smText}>{initials(m.userName)}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={TEXT.commentAuthor}>{m.userName}</Text>
                  <Text style={TEXT.commentText}>{m.message}</Text>
                  <Text style={TEXT.commentTime}>{fmt(m.createdAt)}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={[UTILS.row, { marginTop: SPACING.sm }]}>
            <TextInput
              style={[INPUT_STYLES.commentInput, { flex: 1 }]}
              placeholder="Write a comment..."
              value={text}
              onChangeText={setText}
              multiline
            />
            <TouchableOpacity
              style={[BUTTON.discountPost, { marginLeft: SPACING.sm, paddingHorizontal: SPACING.md }]}
              onPress={send}
              disabled={sending}
            >
              {sending
                ? <ActivityIndicator color={COLORS.white} size="small" />
                : <Text style={BUTTON.discountPostText}>Send</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

//create post modal
function CreatePostModal({ visible, onClose }) {
  const { createPost } = useDiscounts();
  //state
  const [form, setForm] = useState({ title: '', description: '', location: '' });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (key) => (val) => setForm(p => ({ ...p, [key]: val }));

  //pick image
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  //submit post
  const submit = async () => {
    if (!form.title || !form.description || !form.location)
      return Alert.alert('Missing fields', 'Please fill in all fields.');
    setSaving(true);
    const res = await createPost({ ...form, imageUri: image });
    setSaving(false);
    if (res.success) {
      setForm({ title: '', description: '', location: '' });
      setImage(null);
      onClose();
    } else {
      Alert.alert('Error', res.message || 'Failed to create post.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={MODAL.overlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={UTILS.bottomSheet}>
        <ScrollView keyboardShouldPersistTaps="handled" style={MODAL.discountModal} bounces={false}>
          <View style={UTILS.dragHandle} />
          <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.md }]}>Share a Discount</Text>

          <Text style={TEXT.commentAuthor}>Title</Text>
          <TextInput style={INPUT_STYLES.discountInput} placeholder="e.g. 50% off at Jollibee"
            value={form.title} onChangeText={set('title')} />

          <Text style={[TEXT.commentAuthor, { marginTop: SPACING.md }]}>Description</Text>
          <TextInput style={INPUT_STYLES.discountTextArea} placeholder="Describe the discount..."
            multiline value={form.description} onChangeText={set('description')} />

          <Text style={[TEXT.commentAuthor, { marginTop: SPACING.md }]}>Location</Text>
          <TextInput style={INPUT_STYLES.discountInput} placeholder="e.g. SM City Baguio"
            value={form.location} onChangeText={set('location')} />

          <TouchableOpacity onPress={pickImage} style={CARD.imagePicker}>
            {image
              ? <Image source={{ uri: image }} style={CARD.imagePickerPreview} resizeMode="cover" />
              : <Text style={[TYPOGRAPHY.subtitle, { color: COLORS.gray }]}>Tap to attach a photo (optional)</Text>}
          </TouchableOpacity>
          {image && (
            <TouchableOpacity onPress={() => setImage(null)} style={UTILS.alignEnd}>
              <Text style={[TEXT.commentTime, { color: COLORS.red }]}>Remove photo</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[BUTTON.primary, { marginTop: SPACING.lg }]} onPress={submit} disabled={saving}>
            {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={BUTTON.text}>Post Discount</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={[UTILS.center, { paddingVertical: SPACING.sm, marginTop: SPACING.sm }]} onPress={onClose}>
            <Text style={{ color: COLORS.gray }}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

//post card
function PostCard({ post, onComment, onDelete, userId, isAdmin }) {
  const { likePost, votePost } = useDiscounts();
  const [liked, setLiked] = useState(false);

  //handle like
  const handleLike = async () => {
    const res = await likePost(post.id);
    if (res.success) setLiked(res.liked);
  };

  //can delete: own post or admin
  const canDelete = post.author?.id === userId || isAdmin;

  //confirm delete
  const confirmDelete = () =>
    Alert.alert('Delete Post', isAdmin && post.author?.id !== userId ? 'Delete this post as admin?' : 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(post.id) },
    ]);

  return (
    <View style={CARD.discountPost}>
      <View style={CARD.discountPostHeader}>
        <View style={UTILS.row}>
          <View style={AVATAR.sm}><Text style={AVATAR.smText}>{initials(post.author?.name)}</Text></View>
          <View>
            <Text style={TEXT.postAuthor}>{post.author?.name || 'Unknown'}</Text>
            <Text style={TEXT.postTime}>{fmt(post.createdAt)}</Text>
          </View>
        </View>
        <View style={UTILS.row}>
          <StatusBadge status={post.verificationStatus} />
          {/*admin badge*/}
          {isAdmin && post.author?.id !== userId && (
            <View style={{ marginLeft: SPACING.xs, backgroundColor: '#EDE9FE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#7C3AED' }}>ADMIN</Text>
            </View>
          )}
          {canDelete && (
            <TouchableOpacity onPress={confirmDelete} style={{ marginLeft: SPACING.sm }}>
              <Text style={[TEXT.commentTime, { color: COLORS.red, fontWeight: '600' }]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={CARD.discountPostBody}>
        <Text style={TEXT.postTitle}>{post.title}</Text>
        <Text style={TEXT.postBody}>{post.description}</Text>
        {!!post.location && <Text style={TEXT.postLocation}>{post.location}</Text>}
      </View>

      {!!post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={CARD.discountPostImage} resizeMode="cover" />
      )}

      <View style={[UTILS.row, { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, gap: SPACING.sm }]}>
        <TouchableOpacity style={[CHIP.base, { flex: 1, alignItems: 'center' }]} onPress={() => votePost(post.id, 'real')}>
          <Text style={CHIP.text}>Real  {post.votes?.real ?? 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[CHIP.base, { flex: 1, alignItems: 'center' }]} onPress={() => votePost(post.id, 'fake')}>
          <Text style={CHIP.text}>Fake  {post.votes?.fake ?? 0}</Text>
        </TouchableOpacity>
      </View>

      <View style={CARD.discountPostActions}>
        <TouchableOpacity style={[UTILS.row, UTILS.actionBtn]} onPress={handleLike}>
          <Text style={[TEXT.actionIcon, { color: liked ? COLORS.red : COLORS.gray }]}>
            {liked ? 'Liked' : 'Like'}
          </Text>
          <Text style={[TEXT.postTime, { color: liked ? COLORS.red : COLORS.gray }]}>
            {' '}{post.likes ?? 0}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[UTILS.row, UTILS.actionBtn]} onPress={() => onComment(post)}>
          <Text style={TEXT.actionIcon}>Comment</Text>
          <Text style={TEXT.postTime}>{' '}{post.messages ?? 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//main screen
export default function DiscountsScreen() {
  const { posts, loading, fetchPosts, deletePost } = useDiscounts();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  //state
  const [createVisible, setCreateVisible] = useState(false);
  const [commentPost, setCommentPost] = useState(null);

  return (
    <View style={LAYOUT.screen}>
      <View style={LAYOUT.discountsHeader}>
        <View style={UTILS.spaceBetween}>
          <Text style={TYPOGRAPHY.h1}>Discounts</Text>
          <TouchableOpacity style={BUTTON.discountPost} onPress={() => setCreateVisible(true)}>
            <Text style={BUTTON.discountPostText}>+ Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={p => p.id}
        contentContainerStyle={LAYOUT.discountsFeed}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} tintColor={COLORS.navy} />}
        ListEmptyComponent={!loading && (
          <Text style={TEXT.emptyState}>No discount posts yet. Be the first to share one!</Text>
        )}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            userId={user?.id}
            isAdmin={isAdmin}
            onComment={setCommentPost}
            onDelete={deletePost}
          />
        )}
      />

      <CreatePostModal visible={createVisible} onClose={() => setCreateVisible(false)} />
      <CommentSheet post={commentPost} visible={!!commentPost} onClose={() => setCommentPost(null)} />
    </View>
  );
}