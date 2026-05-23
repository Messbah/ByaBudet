import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, Package, Clock, CheckCircle, Car, User, 
  PlusCircle, ArrowRight, HeartHandshake, MessageCircle, 
  Send, ArrowLeft, Info, Home, ShieldCheck, Loader2,
  ShoppingCart, Utensils, Pill, Hammer, MoreHorizontal,
  Route, Filter, Camera, LogOut, Phone, Bell, Flag, Trash2, AlertTriangle, X
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signOut, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail, deleteUser
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, updateDoc, onSnapshot, 
  collection, addDoc, deleteDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDP1eeFMzdwO15AeyXMucpvbo6KNjdzGfA",
  authDomain: "byabudet.firebaseapp.com",
  projectId: "byabudet",
  storageBucket: "byabudet.firebasestorage.app",
  messagingSenderId: "534154862104",
  appId: "1:534154862104:web:0c53201d90a6ee6aa2ed6d",
  measurementId: "G-K8QQP55TL3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-byabudet-app';

const CATEGORIES = [
  { id: 'All', label: 'All', icon: Filter },
  { id: 'Groceries', label: 'Groceries', icon: ShoppingCart },
  { id: 'Food', label: 'Restaurant', icon: Utensils },
  { id: 'Medicine', label: 'OTC Medicine', icon: Pill },
  { id: 'Tools', label: 'Tools/Hardware', icon: Hammer },
  { id: 'Other', label: 'Other Needs', icon: MoreHorizontal }
];

const RequestForm = ({ onSubmit, onCancel, userHome }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [pickupArea, setPickupArea] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffArea, setDropoffArea] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState(userHome || '');
  const [items, setItems] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      title, 
      category, 
      pickup: `${pickupAddress}, ${pickupArea}`, 
      dropoff: `${dropoffAddress}, ${dropoffArea}`, 
      items 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 mb-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-emerald-400"></div>
      <h3 className="text-xl font-bold mb-1 text-slate-800 mt-2">Ask for a Favor</h3>
      <p className="text-sm text-slate-500 mb-5">A verified neighbor heading your way can securely accept this.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
          <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.filter(c => c.id !== 'All').map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">What do you need?</label>
          <input required type="text" placeholder="e.g., Pick up 2 pizzas" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Pickup Location</label>
          <div className="flex gap-2">
            <input required type="text" placeholder="City/Area (e.g., Skellefteå)" className="w-1/2 p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" value={pickupArea} onChange={e => setPickupArea(e.target.value)} />
            <input required type="text" placeholder="Address (e.g., Storgatan 12)" className="w-1/2 p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} />
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Dropoff Location</label>
          <div className="flex gap-2">
            <input required type="text" placeholder="City/Area (e.g., Boliden)" className="w-1/2 p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" value={dropoffArea} onChange={e => setDropoffArea(e.target.value)} />
            <input required type="text" placeholder="Address (e.g., Zinkvägen 2)" className="w-1/2 p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" value={dropoffAddress} onChange={e => setDropoffAddress(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Details & Instructions</label>
          <textarea required rows="2" placeholder="Order number, alternative items..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm resize-none" value={items} onChange={e => setItems(e.target.value)}></textarea>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-3 px-4 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm flex items-center justify-center gap-2">
            <ShieldCheck size={18} /> Post Request
          </button>
        </div>
      </div>
    </form>
  );
};

const RequestCard = ({ req, user, onAccept, onChat, onDeliver, onReport, hasUnread }) => {
  const isMyRequest = req.requesterId === user?.uid;
  const isMyTask = req.driverId === user?.uid;
  const catData = CATEGORIES.find(c => c.id === req.category) || CATEGORIES[CATEGORIES.length - 1];
  const CatIcon = catData.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-4 hover:shadow-md transition-all duration-200 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex flex-shrink-0 items-center justify-center overflow-hidden">
            {req.requesterPhoto ? (
              <img src={req.requesterPhoto} alt={req.requesterName} className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="text-slate-400" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-base leading-tight">{req.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {req.requesterName} {isMyRequest ? '(You)' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg flex flex-col items-center justify-center">
            <CatIcon size={16} className="text-teal-600 mb-0.5" />
            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">{req.category}</span>
          </div>
          {!isMyRequest && req.status === 'pending' && (
            <button onClick={() => {
              if (window.confirm("Report this request for illegal or inappropriate content?")) {
                onReport(req.id);
              }
            }} className="text-slate-300 hover:text-red-500 transition-colors" title="Report Request">
              <Flag size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 inline-block">
        {req.status === 'pending' && (
           <div className="bg-amber-50 text-amber-600 font-semibold px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-amber-100">
             <Clock size={12} /> Waiting for help
           </div>
        )}
        {req.status === 'accepted' && (
           <div className="bg-teal-50 text-teal-700 font-semibold px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-teal-100">
             <Car size={12} /> On the way ({isMyTask ? 'You' : req.driverName})
           </div>
        )}
        {req.status === 'delivered' && (
           <div className="bg-slate-100 text-slate-500 font-semibold px-3 py-1 rounded-full text-xs flex items-center gap-1">
             <CheckCircle size={12} /> Completed
           </div>
        )}
      </div>

      <div className="space-y-3 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex items-start text-sm text-slate-600">
          <div className="mr-3 mt-0.5 text-slate-400"><MapPin size={16} /></div>
          <div>
            <span className="font-medium text-slate-700">{req.pickup}</span>
            <span className="block text-xs text-slate-400 uppercase tracking-wider mt-0.5">Pickup</span>
          </div>
        </div>
        
        <div className="ml-[7px] border-l-2 border-dashed border-slate-200 h-3 my-1"></div>

        <div className="flex items-start text-sm text-slate-600">
          <div className="mr-3 mt-0.5 text-slate-400"><Home size={16} /></div>
          <div>
            <span className="font-medium text-slate-700">{req.dropoff}</span>
            <span className="block text-xs text-slate-400 uppercase tracking-wider mt-0.5">Dropoff</span>
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-600 mb-5 pl-2 border-l-2 border-teal-500 italic">
        "{req.items}"
      </div>

      <div className="border-t border-slate-100 pt-4 flex gap-2">
        {!isMyRequest && req.status === 'pending' && (
          <button onClick={() => onAccept(req.id)} className="w-full bg-teal-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors shadow-sm flex justify-center items-center gap-2">
            <HeartHandshake size={18} /> I can help with this
          </button>
        )}
        
        {req.status === 'accepted' && (isMyRequest || isMyTask) && (
          <>
            <button onClick={() => onChat(req.id)} className="relative flex-1 bg-slate-100 text-slate-800 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors flex justify-center items-center gap-2">
              <MessageCircle size={18} className="text-teal-600" /> Chat
              {hasUnread && (
                <span className="absolute top-2 right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>
            
            {isMyTask && (
              <button onClick={() => onDeliver(req.id)} className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2">
                <CheckCircle size={18} /> Finish
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ChatView = ({ req, chatMessages, user, onBack, onSend }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    onSend(req.id, inputText);
    setInputText('');
  };

  if (!req) return null;
  const isMyRequest = req.requesterId === user?.uid;
  const otherPersonName = isMyRequest ? req.driverName : req.requesterName;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 -mx-4 -mt-4 sm:rounded-2xl sm:overflow-hidden sm:border sm:border-slate-200 sm:h-[600px]">
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 -ml-2 mr-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-slate-800 text-sm">{req.title}</h2>
            <p className="text-xs text-slate-500">Chatting with {otherPersonName}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
             <div className="bg-slate-100 p-4 rounded-full"><MessageCircle size={32} /></div>
             <p className="text-sm">Coordinate delivery with {otherPersonName}</p>
           </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            const date = new Date(msg.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 text-sm ${
                  isMe ? 'bg-teal-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{timeStr}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-3 border-t border-slate-200">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <input 
            type="text" placeholder="Type a message..." 
            className="flex-1 bg-slate-100 border-none rounded-full px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            value={inputText} onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" disabled={!inputText.trim()} className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 disabled:opacity-50 transition-colors">
            <Send size={16} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const ProfileView = ({ userData, onSave, onCancel, onDeleteAccount }) => {
  const [name, setName] = useState(userData?.name || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [address, setAddress] = useState(userData?.address || '');
  const [commuteFrom, setCommuteFrom] = useState(userData?.commuteFrom || '');
  const [commuteTo, setCommuteTo] = useState(userData?.commuteTo || '');
  const [photoUrl, setPhotoUrl] = useState(userData?.photoUrl || '');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create an in-memory canvas to resize the image
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let { width, height } = img;
        
        // Scale down keeping aspect ratio
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to a compressed data URL that fits in Firestore limits safely
        setPhotoUrl(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...userData, name, phone, address, commuteFrom, commuteTo, photoUrl });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-slate-100 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
              {photoUrl ? <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" /> : <User size={32} className="text-slate-400" />}
            </div>
            <div onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-teal-600 text-white p-1.5 rounded-full border-2 border-white cursor-pointer hover:bg-teal-700">
              <Camera size={14} />
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Photo URL (Optional)</label>
          <input type="text" placeholder="https://..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
            <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
            <input type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Home Area / Address</label>
          <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 mt-2">
          <p className="text-xs font-bold text-slate-600 flex items-center gap-1"><Route size={14} className="text-teal-500"/> Daily Commute</p>
          <div className="flex gap-2 items-center">
            <input type="text" placeholder="From" className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" value={commuteFrom} onChange={e => setCommuteFrom(e.target.value)} />
            <ArrowRight size={14} className="text-slate-400" />
            <input type="text" placeholder="To" className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" value={commuteTo} onChange={e => setCommuteTo(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-3 px-4 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm flex items-center justify-center gap-2">
            Save Changes
          </button>
        </div>
        
        <div className="border-t border-slate-100 pt-6 mt-6">
          <button type="button" onClick={() => {
            if (window.confirm("Are you sure you want to permanently delete your account and all data? This cannot be undone.")) {
              onDeleteAccount();
            }
          }} className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100">
            <Trash2 size={16} /> Delete Account & Data
          </button>
        </div>
      </form>
    </div>
  );
};

const AuthAndProfileFlow = ({ onSave, user }) => {
  const [mode, setMode] = useState('login'); 
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showLegal, setShowLegal] = useState(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [commuteFrom, setCommuteFrom] = useState('');
  const [commuteTo, setCommuteTo] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let { width, height } = img;
        
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setPhotoUrl(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (user) {
      if (!user.emailVerified) {
        setMode('verify');
      } else {
        setMode('profile');
      }
    }
  }, [user]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        setMode('verify');
      }
    } catch (error) {
      setErrorMsg(error.message.replace('Firebase: ', ''));
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg('Password reset email sent! Check your inbox.');
      setTimeout(() => setMode('login'), 3000);
    } catch (error) {
      setErrorMsg(error.message.replace('Firebase: ', ''));
    }
  };

  const handleCheckVerification = async () => {
    if (user) {
      setErrorMsg('');
      await user.reload(); 
      if (user.emailVerified) {
        window.location.reload(); 
      } else {
        setErrorMsg("Email still not verified. Please check your inbox and spam folder.");
      }
    }
  };

  const handleResendEmail = async () => {
    try {
      await sendEmailVerification(user);
      setSuccessMsg("Verification email resent!");
    } catch (error) {
      setErrorMsg(error.message.replace('Firebase: ', ''));
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      email: user.email, 
      phone,
      address,
      commuteFrom,
      commuteTo,
      photoUrl: photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=0d9488`
    });
  };

  if (showLegal) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100 overflow-y-auto max-h-[80vh] relative animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => setShowLegal(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-black text-slate-800 mb-6">
            {showLegal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
          </h2>
          
          <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
            {showLegal === 'privacy' ? (
              <>
                <p><strong>1. Data Collection:</strong> We collect your name, phone number, exact address, daily commute route, and profile photo. This data is strictly used to match you with relevant neighborly delivery requests.</p>
                <p><strong>2. Firebase Storage:</strong> Your data is securely stored using Google Firebase. By using this service, you consent to this data processing.</p>
                <p><strong>3. Right to be Forgotten:</strong> You can permanently delete your account and all associated personal data at any time via the "Delete Account & Data" button in your profile settings.</p>
                <p><strong>4. Data Minimization:</strong> We only collect what is strictly necessary to facilitate the platform's core neighbor-to-neighbor features.</p>
              </>
            ) : (
              <>
                <p><strong>1. Non-Commercial Use:</strong> ByaBudet is a community platform for non-profit favors. If you charge delivery fees, you are legally responsible for reporting this as income to Skatteverket.</p>
                <p><strong>2. Age Restriction:</strong> You must be 18 years or older to create an account and accept delivery responsibilities.</p>
                <p><strong>3. Illegal Content:</strong> The transport of illicit or illegal goods (such as drugs or stolen items) is strictly prohibited. Users must report suspicious requests immediately.</p>
                <p><strong>4. Liability:</strong> We are a bulletin board (anslagstavla) connecting neighbors. We are not a transport dispatcher and take no liability for the deliveries themselves or interactions between users.</p>
              </>
            )}
          </div>
          
          <button onClick={() => setShowLegal(null)} className="w-full py-4 mt-8 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md">
            I understand, go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12">
      <div className="w-full max-w-sm mx-auto">
        
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs mb-4 border border-red-100 mt-4">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs mb-4 border border-emerald-100 mt-4">
            {successMsg}
          </div>
        )}

        {(mode === 'login' || mode === 'signup') && (
          <div className="animate-in fade-in slide-in-from-bottom-4 pt-4">
            <div className="w-20 h-20 flex items-center justify-center mb-2 mx-auto">
              <img src="/logo.png" alt="ByaBudet Logo" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <p className="text-sm font-semibold text-teal-600 text-center mb-6 tracking-wide">
              Driven by community. Literally.
            </p>
            <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-tight text-center">
              {mode === 'login' ? 'Welcome Back' : 'Join ByaBudet'}
            </h1>
            <p className="text-base text-slate-500 mb-8 leading-relaxed text-center">
              {mode === 'login' 
                ? 'Log in securely to connect with your neighbors.' 
                : 'Sign up to connect with neighbors. We require verification to keep the community safe.'}
            </p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                <input required type="email" placeholder="neighbor@example.com" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                <input required type="password" placeholder="••••••••" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }} className="text-xs text-teal-600 hover:underline font-semibold">
                    Forgot Password?
                  </button>
                </div>
              )}
              {mode === 'signup' && (
                <div className="flex items-start gap-2 mt-2">
                  <input type="checkbox" id="terms" required checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-1" />
                  <label htmlFor="terms" className="text-xs text-slate-500 leading-tight">
                    I am 18 or older and I agree to the <button type="button" onClick={() => setShowLegal('privacy')} className="text-teal-600 underline hover:text-teal-800">Privacy Policy</button> and <button type="button" onClick={() => setShowLegal('terms')} className="text-teal-600 underline hover:text-teal-800">Terms of Service</button>.
                  </label>
                </div>
              )}
              
              <button type="submit" disabled={mode === 'signup' && !agreedToTerms} className="w-full py-4 mt-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md shadow-teal-200/50 flex justify-center items-center gap-2 disabled:opacity-50">
                {mode === 'login' ? 'Log In' : 'Sign Up'} <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrorMsg(''); setSuccessMsg(''); }} 
                className="text-sm text-slate-500 font-bold hover:text-teal-600 transition-all"
              >
                {mode === 'login' ? "New here? Create an account" : "Already have an account? Log in"}
              </button>
            </div>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="animate-in fade-in slide-in-from-right-8 pt-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 mx-auto text-slate-600">
              <Info size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2 text-center">Reset Password</h1>
            <p className="text-sm text-slate-500 mb-6 text-center">Enter your email and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input required type="email" placeholder="neighbor@example.com" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="w-full py-4 mt-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md">
                Send Reset Link
              </button>
            </form>

            <button onClick={() => setMode('login')} className="w-full mt-4 text-sm text-slate-500 font-bold hover:text-teal-600 transition-all flex justify-center items-center gap-1">
              <ArrowLeft size={16} /> Back to Login
            </button>
          </div>
        )}

        {mode === 'verify' && (
          <div className="animate-in fade-in slide-in-from-top-4 pt-4 text-center">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600 border border-teal-100 shadow-inner">
              <Send size={32} />
            </div>
            <h1 className="text-xl font-black text-slate-800 mb-2">Verify Your Email</h1>
            <p className="text-sm text-slate-500 mb-6 px-2">
              We sent a verification link to <span className="font-bold text-slate-700">{user?.email}</span>. Please click it to activate your account.
            </p>
            
            <div className="space-y-3">
              <button onClick={handleCheckVerification} className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md shadow-teal-200/50">
                I've verified my email
              </button>
              <button onClick={handleResendEmail} className="w-full py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                Resend link
              </button>
            </div>

            <button onClick={() => { signOut(auth); setMode('login'); }} className="mt-6 text-sm text-slate-400 font-bold hover:text-slate-600 transition-colors flex justify-center items-center gap-1 mx-auto">
              <LogOut size={16} /> Use a different account
            </button>
          </div>
        )}

        {mode === 'profile' && (
          <div className="animate-in fade-in slide-in-from-right-8 pt-4">
            <h1 className="text-xl font-black text-slate-800 mb-1">Set up your profile</h1>
            <p className="text-xs text-slate-500 mb-6">This helps us match you with requests on your route.</p>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-slate-100 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {photoUrl ? <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" /> : <User size={32} className="text-slate-400" />}
                  </div>
                  <div onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-teal-600 text-white p-1.5 rounded-full border-2 border-white cursor-pointer hover:bg-teal-700">
                    <Camera size={14} />
                  </div>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input required type="text" placeholder="e.g., Maria E." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                <input type="tel" placeholder="e.g., 070 123 45 67" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Home Area / Address</label>
                <input required type="text" placeholder="e.g., Boliden Centrum" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 mt-2">
                <p className="text-xs font-bold text-slate-600 flex items-center gap-1"><Route size={14} className="text-teal-500"/> Daily Commute (Optional)</p>
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="From (e.g., Skellefteå)" className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" value={commuteFrom} onChange={e => setCommuteFrom(e.target.value)} />
                  <ArrowRight size={14} className="text-slate-400" />
                  <input type="text" placeholder="To (e.g., Boliden)" className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" value={commuteTo} onChange={e => setCommuteTo(e.target.value)} />
                </div>
              </div>

              <button type="submit" disabled={!name.trim() || !address.trim()} className="w-full py-4 mt-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50">
                Complete Setup
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState({});
  
  const [activeTab, setActiveTab] = useState('feed');
  const [activeChatId, setActiveChatId] = useState(null);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  
  const [viewMode, setViewMode] = useState('route'); 
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [lastViewed, setLastViewed] = useState(JSON.parse(localStorage.getItem('byabudet_lastViewed')) || {});

  // 1. Add state to hold the active notification
  const [notification, setNotification] = useState(null);
  
  // Track the exact time the app opened so we don't notify for past history
  const appInitTime = useRef(Date.now());
  
  // Track message IDs we've already shown a notification for
  const notifiedMessageIds = useRef(new Set());
  const notificationTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('byabudet_lastViewed', JSON.stringify(lastViewed));
  }, [lastViewed]);

  useEffect(() => {
    if (activeChatId) {
      setLastViewed(prev => ({ ...prev, [activeChatId]: Date.now() }));
    }
  }, [messages, activeChatId]);

  // 2. Watch for new messages and trigger the notification
  useEffect(() => {
    if (!messages) return;

    const allMsgs = Object.values(messages).flat();
    let latestNewMsg = null;

    allMsgs.forEach(msg => {
      // Is it a newly created message (after app loaded) AND haven't we processed it yet?
      if (msg.timestamp > appInitTime.current && !notifiedMessageIds.current.has(msg.id)) {
        notifiedMessageIds.current.add(msg.id); // Mark as processed so it never triggers again

        // Check if it's from someone else and we aren't currently viewing that specific chat
        if (msg.senderId !== user?.uid && activeChatId !== msg.requestId) {
          if (!latestNewMsg || msg.timestamp > latestNewMsg.timestamp) {
            latestNewMsg = msg;
          }
        }
      }
    });

    // Trigger the notification if we found a valid new message
    if (latestNewMsg) {
      setNotification({
        id: latestNewMsg.id,
        title: latestNewMsg.senderName,
        text: latestNewMsg.text,
        reqId: latestNewMsg.requestId
      });
    }
  }, [messages, activeChatId, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // As soon as a user logs in, show the spinner until their profile downloads
        setAuthLoading(true);
      } else {
        // Nobody is logged in, hide the spinner to show the login screen
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', user.uid);
    const unsubUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData(null);
      }
      setAuthLoading(false);
    }, (err) => {
      console.error("User fetch error:", err);
      setAuthLoading(false);
    });

    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'requests');
    const unsubRequests = onSnapshot(requestsRef, (snapshot) => {
      const reqData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      reqData.sort((a, b) => b.createdAt - a.createdAt);
      setRequests(reqData);
    }, (err) => console.error("Requests fetch error:", err));

    const messagesRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
    const unsubMessages = onSnapshot(messagesRef, (snapshot) => {
      const msgsByReq = {};
      snapshot.docs.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        if (!msgsByReq[data.requestId]) msgsByReq[data.requestId] = [];
        msgsByReq[data.requestId].push(data);
      });
      Object.keys(msgsByReq).forEach(reqId => {
        msgsByReq[reqId].sort((a, b) => a.timestamp - b.timestamp);
      });
      setMessages(msgsByReq);
    }, (err) => console.error("Messages fetch error:", err));

    return () => {
      unsubUser();
      unsubRequests();
      unsubMessages();
    };
  }, [user]);

  const handleSaveProfile = async (profileData) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', user.uid), {
      ...profileData,
      uid: user.uid,
      joinedAt: userData?.joinedAt || Date.now()
    }, { merge: true });
    
    if (activeTab === 'profile') {
      setActiveTab('feed');
    }
  };

  const handleAddRequest = async (requestData) => {
    if (!user || !userData) return;
    const requestsRef = collection(db, 'artifacts', appId, 'public', 'data', 'requests');
    await addDoc(requestsRef, {
      ...requestData,
      status: "pending",
      requesterId: user.uid,
      requesterName: userData.name,
      requesterPhoto: userData.photoUrl,
      driverId: null,
      driverName: null,
      createdAt: Date.now()
    });
    setShowNewRequestForm(false);
    setActiveTab('my_requests');
  };

  const handleAcceptRequest = async (reqId) => {
    if (!user || !userData) return;
    const reqRef = doc(db, 'artifacts', appId, 'public', 'data', 'requests', reqId);
    await updateDoc(reqRef, {
      status: "accepted",
      driverId: user.uid,
      driverName: userData.name,
      acceptedAt: Date.now()
    });
    setActiveTab('my_tasks');
  };

  const handleMarkDelivered = async (reqId) => {
    if (!user) return;
    const reqRef = doc(db, 'artifacts', appId, 'public', 'data', 'requests', reqId);
    await updateDoc(reqRef, {
      status: "delivered",
      deliveredAt: Date.now()
    });
    setActiveChatId(null);
  };

  const openChat = (reqId) => {
    setActiveChatId(reqId);
    setLastViewed(prev => ({ ...prev, [reqId]: Date.now() }));
  };

  const handleSendMessage = async (reqId, text) => {
    if (!user || !text.trim() || !userData) return;
    const messagesRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
    await addDoc(messagesRef, {
      requestId: reqId,
      senderId: user.uid,
      senderName: userData.name,
      text: text.trim(),
      timestamp: Date.now()
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', user.uid);
      await deleteDoc(userRef);
      await deleteUser(user);
      setUserData(null);
      setUser(null);
      window.location.reload();
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Failed to delete account. You may need to log out and log back in first.");
    }
  };

  const handleReportRequest = async (reqId) => {
    if (!user) return;
    const reqRef = doc(db, 'artifacts', appId, 'public', 'data', 'requests', reqId);
    await updateDoc(reqRef, { reported: true });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-teal-600">
          <Loader2 className="animate-spin" size={32} />
          <p className="font-medium">Connecting to community...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.emailVerified || !userData) {
    return <AuthAndProfileFlow onSave={handleSaveProfile} user={user} />;
  }

  const isRequestOnRoute = (req) => {
    if (!userData) return true;
    const getKeywords = (str) => (str || '').toLowerCase().split(/[\s,]+/).filter(w => w.length > 2);
    
    const userHubs = [
      ...getKeywords(userData.address),
      ...getKeywords(userData.commuteFrom),
      ...getKeywords(userData.commuteTo)
    ];

    const reqPickup = (req.pickup || '').toLowerCase();
    const reqDropoff = (req.dropoff || '').toLowerCase();

    const pickupOnRoute = userHubs.some(word => reqPickup.includes(word));
    const dropoffOnRoute = userHubs.some(word => reqDropoff.includes(word));

    const hasCommute = getKeywords(userData.commuteFrom).length > 0 || getKeywords(userData.commuteTo).length > 0;
    
    if (hasCommute) {
      return pickupOnRoute && dropoffOnRoute;
    } 
    return pickupOnRoute || dropoffOnRoute;
  };

  const pendingCommunityFeed = requests.filter(r => r.status === 'pending' && r.requesterId !== user?.uid && !r.reported);
  const myRequestsList = requests.filter(r => r.requesterId === user?.uid);
  const myDeliveriesList = requests.filter(r => r.driverId === user?.uid);

  const hasUnreadMsg = (reqId) => {
    const chatMsgs = messages[reqId] || [];
    const lastMsg = chatMsgs[chatMsgs.length - 1];
    if (!lastMsg || lastMsg.senderId === user?.uid) return false;
    if (activeChatId === reqId) return false;
    const viewedTime = lastViewed[reqId] || 0;
    return lastMsg.timestamp > viewedTime;
  };

  let activeList = [];
  if (activeTab === 'feed') {
    let baseList = viewMode === 'route' ? pendingCommunityFeed.filter(isRequestOnRoute) : pendingCommunityFeed;
    activeList = activeCategory === 'All' ? baseList : baseList.filter(r => r.category === activeCategory);
  } else if (activeTab === 'my_requests') {
    activeList = myRequestsList;
  } else if (activeTab === 'my_tasks') {
    activeList = myDeliveriesList;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 sm:py-8 flex justify-center">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[800px] sm:rounded-[2.5rem] sm:shadow-2xl sm:shadow-slate-300/50 sm:border-[8px] sm:border-white relative overflow-hidden flex flex-col">
        
        {/* 3. The Notification Toast UI */}
        {notification && (
          <button 
            key={notification.id}
            onClick={() => { openChat(notification.reqId); setNotification(null); }}
            className="absolute top-20 left-1/2 -translate-x-1/2 bg-teal-600 text-white px-5 py-2.5 rounded-full shadow-lg z-50 animate-in slide-in-from-top-4 fade-in duration-300 flex items-center gap-2 cursor-pointer border border-teal-500 hover:bg-teal-700 transition-colors whitespace-nowrap"
          >
            <Bell size={16} className="animate-pulse" />
            <span className="text-sm font-bold">Message from {notification.title}</span>
          </button>
        )}

        <header className="bg-white border-b border-slate-200 px-5 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-200 text-white">
              <HeartHandshake size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">ByaBudet</h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1 flex items-center gap-1">
                Neighbor to Neighbor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 transition-colors" title="Log Out">
               <LogOut size={18} />
             </button>
             <button onClick={() => {setActiveTab('profile'); setShowNewRequestForm(false); setActiveChatId(null);}} className="h-9 w-9 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center hover:ring-2 hover:ring-teal-500 transition-all cursor-pointer">
               {userData?.photoUrl ? (
                 <img src={userData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User size={16} className="text-slate-400" />
               )}
             </button>
          </div>
        </header>

        {!activeChatId && activeTab !== 'profile' && (
          <div className="bg-white px-4 pt-4 border-b border-slate-200 shadow-sm z-30">
            <div className="flex gap-4">
              <button onClick={() => {setActiveTab('feed'); setShowNewRequestForm(false);}} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'feed' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                Dashboard
              </button>
              <button onClick={() => {setActiveTab('my_requests'); setShowNewRequestForm(false);}} className={`relative pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'my_requests' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                My Requests
                {myRequestsList.some(r => hasUnreadMsg(r.id)) && <span className="absolute top-0 -right-2 h-2 w-2 rounded-full bg-red-500"></span>}
              </button>
              <button onClick={() => {setActiveTab('my_tasks'); setShowNewRequestForm(false);}} className={`relative pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'my_tasks' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                Deliveries
                {myDeliveriesList.some(r => hasUnreadMsg(r.id)) && <span className="absolute top-0 -right-2 h-2 w-2 rounded-full bg-red-500"></span>}
              </button>
            </div>
          </div>
        )}

        {!activeChatId && activeTab === 'feed' && !showNewRequestForm && (
          <div className="bg-white px-4 py-3 border-b border-slate-200 z-20">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              <button 
                onClick={() => setViewMode('route')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'route' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Route size={14} /> My Route
              </button>
              <button 
                onClick={() => setViewMode('all')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'all' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <MapPin size={14} /> All Region
              </button>
            </div>

            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4 snap-x">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border whitespace-nowrap text-xs font-semibold transition-colors snap-start ${
                      isActive ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-teal-200' : 'text-slate-400'} />
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <main className="flex-1 p-4 overflow-y-auto bg-slate-50/50">
          {activeTab === 'profile' ? (
            <ProfileView userData={userData} onSave={handleSaveProfile} onCancel={() => setActiveTab('feed')} onDeleteAccount={handleDeleteAccount} />
          ) : activeChatId ? (
            <ChatView 
              req={requests.find(r => r.id === activeChatId)}
              chatMessages={messages[activeChatId] || []}
              user={user}
              onBack={() => setActiveChatId(null)}
              onSend={handleSendMessage}
            />
          ) : (
            <div className="space-y-4">
              
              {activeTab === 'feed' && !showNewRequestForm && (
                <div className="flex gap-2 mb-2">
                  <button onClick={() => setShowNewRequestForm(true)} className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-3.5 rounded-2xl text-sm font-bold hover:bg-teal-700 transition-all shadow-sm">
                    <PlusCircle size={18} /> Make Request
                  </button>
                </div>
              )}
              {activeTab === 'my_requests' && !showNewRequestForm && (
                <button onClick={() => setShowNewRequestForm(true)} className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-3.5 rounded-2xl text-sm font-bold hover:bg-teal-700 transition-all shadow-sm mb-2">
                  <PlusCircle size={18} /> New Request
                </button>
              )}

              {showNewRequestForm && (
                <RequestForm onSubmit={handleAddRequest} onCancel={() => setShowNewRequestForm(false)} userHome={userData?.address} />
              )}

              {!showNewRequestForm && activeList.length === 0 && (
                <div className="text-center p-8 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 mt-4">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    {activeTab === 'feed' ? <Route size={24} className="text-teal-300" /> : 
                     activeTab === 'my_requests' ? <Package size={24} className="text-teal-300" /> : 
                     <Car size={24} className="text-teal-300" />}
                  </div>
                  <p className="font-medium text-slate-600 mb-1">
                    {activeTab === 'feed' && viewMode === 'route' ? 'Nothing on your route.' : 
                     activeTab === 'feed' && viewMode === 'all' ? 'No active requests in this category.' :
                     activeTab === 'my_requests' ? 'No active requests.' : 
                     "You haven't accepted any tasks."}
                  </p>
                  <p className="text-sm">
                    {activeTab === 'feed' && viewMode === 'route' ? 'Try checking "All Region" or change filters.' : ''}
                  </p>
                </div>
              )}

              {activeList.map(req => (
                <RequestCard 
                  key={req.id} 
                  req={req} 
                  user={user}
                  onAccept={handleAcceptRequest}
                  onChat={openChat}
                  onDeliver={handleMarkDelivered}
                  onReport={handleReportRequest}
                  hasUnread={hasUnreadMsg(req.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}