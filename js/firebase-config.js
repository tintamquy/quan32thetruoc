// ============================================
// FIREBASE CONFIGURATION
// File này chứa cấu hình Firebase và khởi tạo các services
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBAnZbudUnDlbKMrEEg1C1GgBUWWa8P1_o",
    authDomain: "thetruoc-4985f.firebaseapp.com",
    projectId: "thetruoc-4985f",
    storageBucket: "thetruoc-4985f.firebasestorage.app",
    messagingSenderId: "505481535664",
    appId: "1:505481535664:web:8abc4cf9df2c0ebd7d9b75",
    measurementId: "G-SKP15647VL"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Export app để sử dụng ở các file khác nếu cần
export default app;

