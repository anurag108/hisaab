import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { firebaseApp } from "./firebase_client";

const userCollectionName = "user";
const db = getFirestore(firebaseApp);
const userCollectionRef = collection(db, userCollectionName);

export async function checkLoginDetails(email: string, password: string) {
    const userSnapshot = await getDocs(
        query(userCollectionRef,
            where('email', '==', email),
            where('password', '==', password),
            where('status', '==', 'ACTIVE')
        )
    );
    if (userSnapshot.empty) {
        return null;
    }
    if (userSnapshot.size > 1) {
        throw new Error("Multiple users found for the same email");
    }

    const userSnap = userSnapshot.docs[0];
    const data = userSnap.data();
    return {
        id: userSnap.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        status: data.status,
        creationTime: data.creationTime,
        updateTime: data.updateTime
    };
}