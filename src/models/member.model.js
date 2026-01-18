// src/models/membre.model.js
import mongoose from "mongoose";

const membreSchema = new mongoose.Schema(
  {
    nomComplet: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    telephone: {
      type: String,   // ✅ بدل Number ➜ String
      required: true,
      trim: true,
    },

    role: {
      type: String,
      default: "Bénévole",
    },

    cv: {
      type: String, // path du fichier
      default: null,
    },

    statut: {
      type: String,
      enum: ["en_attente", "approuve", "rejete"],
      default: "en_attente",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Membre", membreSchema);
