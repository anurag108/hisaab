import nodemailer from 'nodemailer'
import { BizUserMapping } from '../types';
import { getBusiness } from '../firestore/business_db';
import fs from 'fs';
import { encryptInvitationInfo } from '../encryption_utils';

const fromEmail = "hellofromhisaab@gmail.com";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: fromEmail,
        pass: "efds enmn qiys ovzu"
    }
});

export async function sendEmail(toAddress: string, subject: string, plaintext?: string, html?: string) {
    const info = await transporter.sendMail({
        from: fromEmail,
        to: toAddress,
        subject,
        text: plaintext,
        html,
    });
    console.log("Email info", info);
    return info;
}

export async function sendTraderInvitationEmail(toAddress: string, invitation: BizUserMapping) {
    const biz = await getBusiness(invitation.businessId);
    if (!biz) {
        throw new Error("BIZ_NOT_FOUND");
    }
    const invitationCipher = encryptInvitationInfo(invitation.id);
    const subject = biz.name + " has invited you to work together on Hisaab!";
    const acceptInviteURL = "http://localhost:8080/trader/invitation/" + invitationCipher;
    const declineInviteURL = "http://localhost:8080/trader/invitation/" + invitationCipher;
    const inviteTraderHTML = fs.readFileSync(__dirname + "/inviteTrader.html").toString();
    const invitationHTML = inviteTraderHTML.replace("{{BIZ_NAME}}", biz.name)
        .replace("{{ACCEPT_INVITE}}", acceptInviteURL)
        .replace("{{DECLINE_INVITE}}", declineInviteURL);

    console.log(invitationHTML);
    return await sendEmail(toAddress, subject, subject, invitationHTML);
}