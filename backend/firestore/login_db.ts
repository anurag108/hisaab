import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    QuerySnapshot,
    DocumentData,
    addDoc,
} from "firebase/firestore";
import { firebaseApp } from "./firebase_client";

const userCollectionName = "user";
const db = getFirestore(firebaseApp);
const userCollectionRef = collection(db, userCollectionName);

function buildUserFromSnapshot(userSnapshot: QuerySnapshot<DocumentData, DocumentData>) {
    const userSnap = userSnapshot.docs[0];
    const data = userSnap.data();
    return {
        id: userSnap.id,
        name: data.name,
        email: data.email,
        phone: {
            countryCode: data.countryCode,
            phoneNumber: data.phoneNumber,
        },
        status: data.status,
        creationTime: data.creationTime,
        updateTime: data.updateTime
    };
}

export async function checkLoginDetails(email: string, password: string) {
    const userQuerySnapshot = await getDocs(
        query(userCollectionRef,
            where('email', '==', email),
            where('password', '==', password),
            where('status', '==', 'ACTIVE')
        )
    );
    if (userQuerySnapshot.empty) {
        return null;
    }
    if (userQuerySnapshot.size > 1) {
        throw new Error("Multiple users found for the same email");
    }
    return buildUserFromSnapshot(userQuerySnapshot);
}

export async function genUserByEmail(email: string) {
    const userQuerySnapshot = await getDocs(
        query(userCollectionRef,
            where('email', '==', email),
        )
    );
    if (userQuerySnapshot.empty) {
        return null;
    }
    if (userQuerySnapshot.size > 1) {
        throw new Error("Multiple users found for the same email");
    }
    return buildUserFromSnapshot(userQuerySnapshot);
}

export async function signupNewUser(name: string, countryCode: string, phoneNumber: string, email: string, password: string) {
    const currTime = Date.now();
    const userRef = await addDoc(userCollectionRef, {
        name,
        countryCode,
        phoneNumber,
        email,
        password,
        status: "PENDING_EMAIL_VERIFICATION",
        creationTime: currTime,
        updateTime: currTime
    });
    return {
        id: userRef.id,
        name,
        countryCode,
        phoneNumber,
        email,
        status: "PENDING_EMAIL_VERIFICATION",
        creationTime: currTime,
        updateTime: currTime
    }
}