# Communication Deck - Full CRUD Implementation

## ✅ CRUD Functions Implemented

### **1. CREATE - Add New Conversation**
```typescript
const handleCreateConversation = (contact: string, source: 'SMS' | 'Voice' | 'Web Chat') => {
  const newConv = {
    id: Date.now(),
    contact,
    source,
    status: 'New',
    lastMsg: 'Conversation started',
    time: 'Just now',
    unread: true,
    avatarColor: source === 'SMS' ? 'bg-emerald-500' : source === 'Voice' ? 'bg-orange-500' : 'bg-blue-500'
  };
  setConversations([newConv, ...conversations]);
  setSelectedConversation(newConv.id);
  setShowNewConversation(false);
};
```

**Features:**
- Creates new conversation with unique ID (timestamp)
- Auto-selects appropriate avatar color based on source
- Adds to top of conversation list
- Auto-selects the new conversation
- Closes the "New Conversation" modal

### **2. READ - View Conversations & Messages**
```typescript
// Filter messages for selected conversation
const currentMessages = messages.filter(msg => msg.conversationId === selectedConversation);

// Display in UI
{conversations.map(conv => (
  <div onClick={() => setSelectedConversation(conv.id)}>
    {/* Conversation preview */}
  </div>
))}
```

**Features:**
- View all conversations in left sidebar
- Click to select and view full conversation
- Messages filtered by conversation ID
- Real-time updates when new messages arrive

### **3. UPDATE - Send Messages & Mark as Read**

#### Send Message:
```typescript
const handleSendMessage = () => {
  if (!inputText.trim()) return;

  const newMessage = {
    id: Date.now(),
    conversationId: selectedConversation,
    role: 'user' as 'user' | 'ai',
    text: inputText,
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  };

  setMessages([...messages, newMessage]);
  
  // Update conversation last message
  setConversations(conversations.map(conv =>
    conv.id === selectedConversation
      ? { ...conv, lastMsg: inputText, time: 'Just now' }
      : conv
  ));

  setInputText('');
};
```

#### Mark as Read:
```typescript
const handleMarkAsRead = (id: number) => {
  setConversations(conversations.map(conv =>
    conv.id === id ? { ...conv, unread: false } : conv
  ));
};
```

**Features:**
- Send new messages to current conversation
- Auto-timestamp with current time
- Updates conversation preview with last message
- Clears input field after sending
- Mark conversations as read/unread

### **4. DELETE - Remove Conversation**
```typescript
const handleDeleteConversation = (id: number) => {
  if (confirm('Are you sure you want to delete this conversation?')) {
    setConversations(conversations.filter(conv => conv.id !== id));
    setMessages(messages.filter(msg => msg.conversationId !== id));
    if (selectedConversation === id && conversations.length > 1) {
      setSelectedConversation(conversations[0].id);
    }
    setConversationMenuId(null);
  }
};
```

**Features:**
- Confirmation dialog before deletion
- Removes conversation from list
- Removes all associated messages
- Auto-selects another conversation if current one is deleted
- Closes dropdown menu after deletion

## 🎯 UI Integration Needed

### **1. Add "New Conversation" Button**
```tsx
// In conversation list header
<button 
  onClick={() => setShowNewConversation(true)}
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
>
  <Plus size={16} /> New Conversation
</button>
```

### **2. Add "New Conversation" Modal**
```tsx
{showNewConversation && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full">
      <h3>Start New Conversation</h3>
      <input placeholder="Contact name or number" />
      <select>
        <option value="SMS">SMS</option>
        <option value="Voice">Voice</option>
        <option value="Web Chat">Web Chat</option>
      </select>
      <button onClick={() => handleCreateConversation(contact, source)}>
        Create
      </button>
    </div>
  </div>
)}
```

### **3. Add Dropdown Menu to Conversations**
```tsx
// In each conversation item
<button 
  onClick={(e) => {
    e.stopPropagation();
    setConversationMenuId(conv.id);
  }}
>
  <MoreVertical size={16} />
</button>

{conversationMenuId === conv.id && (
  <div className="absolute right-0 bg-white rounded-lg shadow-xl">
    <button onClick={() => handleMarkAsRead(conv.id)}>
      Mark as Read
    </button>
    <button onClick={() => handleDeleteConversation(conv.id)}>
      Delete
    </button>
  </div>
)}
```

### **4. Wire Up Send Button**
```tsx
// Update send button
<button 
  onClick={handleSendMessage}
  className="p-1.5 bg-indigo-600 text-white rounded-lg"
>
  <Send size={16} />
</button>

// Add Enter key support
<input
  onKeyPress={(e) => {
    if (e.key === 'Enter') handleSendMessage();
  }}
/>
```

### **5. Update Message Display**
```tsx
// Replace static messages with currentMessages
{currentMessages.map((msg) => (
  <div key={msg.id}>
    {/* Message bubble */}
  </div>
))}
```

## 📊 State Management

### **Conversations State:**
```typescript
const [conversations, setConversations] = useState([
  {
    id: number,
    contact: string,
    source: 'SMS' | 'Voice' | 'Web Chat',
    status: string,
    lastMsg: string,
    time: string,
    unread: boolean,
    avatarColor: string
  }
]);
```

### **Messages State:**
```typescript
const [messages, setMessages] = useState([
  {
    id: number,
    conversationId: number,
    role: 'user' | 'ai',
    text: string,
    time: string,
    agent?: string  // Only for AI messages
  }
]);
```

### **UI State:**
```typescript
const [selectedConversation, setSelectedConversation] = useState<number>(1);
const [inputText, setInputText] = useState('');
const [showNewConversation, setShowNewConversation] = useState(false);
const [conversationMenuId, setConversationMenuId] = useState<number | null>(null);
```

## 🚀 Next Steps

1. **Add New Conversation Modal** - Complete UI for creating conversations
2. **Add Dropdown Menus** - Three-dot menu for each conversation
3. **Wire Send Button** - Connect to `handleSendMessage`
4. **Add Enter Key Handler** - Send on Enter press
5. **Update Message Display** - Use `currentMessages` instead of static data
6. **Add Search Filter** - Filter conversations by contact name
7. **Add Source Filter** - Filter by SMS/Voice/Chat
8. **Add Bulk Actions** - Mark all as read, delete multiple
9. **Add Export** - Export conversation history
10. **Add AI Response** - Simulate AI responses after user messages

## 🎯 Features to Add

### **Auto-AI Response:**
```typescript
const simulateAIResponse = () => {
  setTimeout(() => {
    const aiMessage = {
      id: Date.now(),
      conversationId: selectedConversation,
      role: 'ai' as 'user' | 'ai',
      text: 'I understand. Let me help you with that...',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      agent: 'Hunter Protocol'
    };
    setMessages(prev => [...prev, aiMessage]);
  }, 2000);
};
```

### **Typing Indicator:**
```typescript
const [isAITyping, setIsAITyping] = useState(false);

// Show while AI is "thinking"
{isAITyping && (
  <div className="flex items-center gap-2">
    <Bot size={14} />
    <span>Hunter Protocol is typing...</span>
  </div>
)}
```

### **Conversation Stats:**
```typescript
const stats = {
  total: conversations.length,
  unread: conversations.filter(c => c.unread).length,
  aiHandled: conversations.filter(c => c.status === 'AI Handling').length
};
```

---

**Status:** CRUD functions implemented, UI integration in progress
**Impact:** Full conversation management with create, read, update, and delete capabilities
