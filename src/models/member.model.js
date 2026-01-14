// src/models/membre.model.js
import mongoose from "mongoose";

const membreSchema = new mongoose.Schema(
  {
    nomComplet: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    telephone: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "Bénévole",
    },

    cv: {
      type: String, // chemin du fichier
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
