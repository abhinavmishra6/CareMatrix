const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const departments = [
  { name: "Doctor", role: "DOCS", password: "Docs@123" },
  { name: "Nursing", role: "NURS", password: "Nurse@123" },
  { name: "Laboratory", role: "LABS", password: "Labs@123" },
  { name: "Radiology", role: "RADS", password: "Radio@123" },
  { name: "Pharmacy", role: "PHAR", password: "Phar@123" },
  { name: "Billing", role: "BILL", password: "Bill@123" },
  { name: "Insurance Desk", role: "INSR", password: "Ins@123" },
  { name: "Medical Records", role: "MEDR", password: "Med@123" },
  { name: "Reception", role: "RECP", password: "Recep@123" },
  { name: "Discharge Management", role: "DISC", password: "Disc@123" },
  { name: "Accounts", role: "ACCS", password: "Acc@123" },
  { name: "Administration", role: "ADMIN", password: "Admin@123" },
];

async function createUsers() {
  for (let dept of departments) {

    const email = dept.name.toLowerCase().replace(/\s/g, "") + "@carematrix.com";

    try {
      const user = await admin.auth().createUser({
        email: email,
        password: dept.password,
      });

      await db.collection("staff").doc(email).set({
        name: dept.name,
        role: dept.role,
        email: email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Created: ${email}`);

    } catch (error) {
      console.log(`❌ Error for ${email}:`, error.message);
    }
  }
}

createUsers();