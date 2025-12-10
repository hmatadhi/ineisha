import {onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

// Initialize Firebase Admin (only once)
initializeApp();
const db = getFirestore();

/**
 * Handles booking submissions from the HTML form.
 * Replaces the Google Apps Script functionality.
 * Stores booking data in Firestore and returns a JSON response.
 */
export const proxyToAppsScript = onRequest(
    {
      region: "us-central1",
      cors: true,
    },
    async (req, res) => {
      // Handle CORS preflight
      if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        res.status(204).send("");
        return;
      }

      // Only allow POST requests
      if (req.method !== "POST") {
        res.set("Access-Control-Allow-Origin", "*");
        res.status(405).json({
          status: "error",
          message: "Method not allowed. Use POST.",
        });
        return;
      }

      try {
        // Extract booking data from request body
        const {name, address, contact, tests} = req.body;

        // Validate required fields
        if (!name || !address || !contact || !tests || !Array.isArray(tests)) {
          res.set("Access-Control-Allow-Origin", "*");
          res.status(400).json({
            status: "error",
            message: "Missing required fields: " +
                "name, address, contact, and tests are required.",
          });
          return;
        }

        // Validate tests array has at least one test
        if (tests.length === 0) {
          res.set("Access-Control-Allow-Origin", "*");
          res.status(400).json({
            status: "error",
            message: "At least one test is required.",
          });
          return;
        }

        // Create booking document
        const bookingData = {
          name: name.trim(),
          address: address.trim(),
          contact: contact.trim(),
          tests: tests.map((test) => ({
            name: test.name?.trim() || "",
            description: test.description?.trim() || "",
          })),
          timestamp: new Date(),
          status: "pending",
        };

        // Save to Firestore
        const docRef = await db.collection("bookings").add(bookingData);

        // Log for debugging
        console.log("Booking saved:", {
          id: docRef.id,
          name: bookingData.name,
          contact: bookingData.contact,
          testCount: bookingData.tests.length,
        });

        // Return success response
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Content-Type", "application/json");
        res.status(200).json({
          status: "success",
          message: "Booking request submitted successfully!",
          bookingId: docRef.id,
        });
      } catch (error) {
        console.error("Booking submission error:", error);
        res.set("Access-Control-Allow-Origin", "*");
        res.status(500).json({
          status: "error",
          message: "Failed to process booking request. Please try again later.",
        });
      }
    },
);

