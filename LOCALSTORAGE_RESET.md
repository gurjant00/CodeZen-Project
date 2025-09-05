# localStorage Reset Utility

If you're still having issues with the demo account, you can run this in your browser's console to reset everything:

## 🔧 **Quick Fix - Run in Browser Console:**

Open your browser's Developer Tools (F12), go to Console tab, and paste this code:

```javascript
// Clear all app data and recreate demo user
console.log("=== Resetting Smart Student Companion Data ===");

// Clear all existing data
localStorage.removeItem('users');
localStorage.removeItem('user');
localStorage.removeItem('user_demo_001_data');

// Create fresh demo user
const demoUser = {
  id: 'demo_001',
  email: 'student@demo.com',
  password: 'demo123',
  name: 'Demo Student'
};

localStorage.setItem('users', JSON.stringify([demoUser]));

console.log("✅ Demo user created successfully!");
console.log("You can now sign in with:");
console.log("Email: student@demo.com");
console.log("Password: demo123");

// Refresh the page
location.reload();
```

## 📋 **Alternative - Manual Reset:**

1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `http://localhost:3000`
4. Delete these keys if they exist:
   - `users`
   - `user`  
   - `user_demo_001_data`
5. Refresh the page

## 🕵️ **Debug - Check Current State:**

To see what's currently in localStorage:

```javascript
console.log("Current users:", localStorage.getItem('users'));
console.log("Current user:", localStorage.getItem('user'));
console.log("Demo user data:", localStorage.getItem('user_demo_001_data'));
```

## 🎯 **Expected Result:**

After running the reset, you should see:
- Demo account works with `student@demo.com` / `demo123`
- Console shows "Demo user created/updated" message on page load
- Sign-in authentication debugging in console (if still enabled)

## 🚀 **Production Note:**

The console.log debugging messages will be removed before final deployment. They're only there to help troubleshoot the current issue.
