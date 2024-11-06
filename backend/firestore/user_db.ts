import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    QuerySnapshot,
    DocumentData,
    addDoc,
    QueryDocumentSnapshot,
    documentId,
} from "firebase/firestore";
import { firebaseApp } from "./firebase_client";
import { User, UserStatus } from "../types";
import { hashPassword } from "../encryption_utils";

const userCollectionName = "user";
const db = getFirestore(firebaseApp);
const userCollectionRef = collection(db, userCollectionName);

function buildUserFromSnapshot(
    userSnap: QueryDocumentSnapshot<DocumentData, DocumentData>,
    returnHashedPassword: boolean = false) {
    const data = userSnap.data();
    return {
        id: userSnap.id,
        name: data.name,
        email: data.email,
        hashedPassword: returnHashedPassword ? data.hashedPassword : null,
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
            where('status', '==', UserStatus.ACTIVE)
        )
    );
    if (userQuerySnapshot.empty) {
        return null;
    }
    if (userQuerySnapshot.size > 1) {
        throw new Error("Multiple users found for the same email");
    }
    return buildUserFromSnapshot(userQuerySnapshot.docs[0], true);
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
    return buildUserFromSnapshot(userQuerySnapshot.docs[0]);
}

export async function signupNewUser(name: string, countryCode: string, phoneNumber: string, email: string, password: string) {
    const currTime = Date.now();
    const hashedPassword = await hashPassword(password);
    const userData = {
        name,
        countryCode,
        phoneNumber,
        email,
        hashedPassword,
        status: UserStatus.PENDING_EMAIL_VERIFICATION,
        creationTime: currTime,
        updateTime: currTime
    };
    const userRef = await addDoc(userCollectionRef, userData);
    return {
        id: userRef.id,
        name,
        hashedPassword: null,
        phone: {
            countryCode,
            phoneNumber,
        },
        email,
        status: UserStatus.PENDING_EMAIL_VERIFICATION,
        creationTime: currTime,
        updateTime: currTime
    }
}

export async function createPartialUser(email: string) {
    const currTime = Date.now();
    const status = UserStatus.PENDING_EMAIL_VERIFICATION;
    const userRef = await addDoc(userCollectionRef, {
        email,
        status,
        creationTime: currTime,
        updateTime: currTime
    });
    return {
        id: userRef.id,
        name: null,
        hashedPassword: null,
        phone: {
            countryCode: null,
            phoneNumber: null,
        },
        email,
        status,
        creationTime: currTime,
        updateTime: currTime
    };
}

export async function genUsers(ids: string[]) {
    const q = query(userCollectionRef, where(documentId(), "in", ids));
    const userSnaps = await getDocs(q);
    const users: User[] = [];
    userSnaps.forEach((snap) => users.push(buildUserFromSnapshot(snap)));
    return users;
}