// src/controllers/member.controller.js
import Membre from "../models/member.model.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

/* =====================================================
   🟢 INSCRIPTION BÉNÉVOLE (PUBLIC)
===================================================== */
export const inscrireMembre = async (req, res) => {
  try {
    const { nomComplet, email, telephone } = req.body;
  const membre = await Membre.create({
       nomComplet,
        email,
         telephone,
         role: "Bénévole",
         statut: "en_attente",
         
});

    res.status(201).json({
      message: "Inscription du bénévole réussie",
      membre,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   🟢 GET MEMBRES (ADMIN)
   - filtres
   - pagination
   - recherche
===================================================== */
export const getMembres = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limite = Number(req.query.limite) || 10;

    const { statut, role, recherche } = req.query;
    const query = {};

    /* Filtrer par statut */
    if (statut) {
      query.statut = statut; // en_attente | approuve | rejete
    }

    /* Filtrer par rôle */
    if (role) {
      query.role = role;
    }

    /* Recherche par nom ou email */
    if (recherche) {
      query.$or = [
        { nomComplet: { $regex: recherche, $options: "i" } },
        { email: { $regex: recherche, $options: "i" } },
      ];
    }

    const total = await Membre.countDocuments(query);

    const membres = await Membre.find(query)
      .skip((page - 1) * limite)
      .limit(limite)
      .sort({ createdAt: -1 });

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limite),
      membres,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   🟢 APPROUVER MEMBRE (ADMIN)
===================================================== */
export const approuverMembre = async (req, res) => {
  try {
    const membre = await Membre.findById(req.params.id);

    if (!membre) {
      return res.status(404).json({ message: "Membre introuvable" });
    }

    membre.statut = "approuve";
    await membre.save();

    res.json({ message: "Membre approuvé", membre });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   🟢 REJETER MEMBRE (ADMIN)
===================================================== */
export const rejeterMembre = async (req, res) => {
  try {
    const membre = await Membre.findById(req.params.id);

    if (!membre) {
      return res.status(404).json({ message: "Membre introuvable" });
    }

    membre.statut = "rejete";
    await membre.save();

    res.json({ message: "Membre rejeté", membre });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   🟢 EXPORT EXCEL (ADMIN)
===================================================== */
export const exportExcel = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Membres");

    sheet.addRow(["Nom complet", "Email", "Téléphone", "Statut"]);

    const membres = await Membre.find();
    membres.forEach((m) => {
      sheet.addRow([m.nomComplet, m.email, m.telephone, m.statut]);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=membres.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   🟢 EXPORT PDF (ADMIN)
===================================================== */
export const exportPDF = async (req, res) => {
  try {
    const doc = new PDFDocument();
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=membres.pdf"
    );
    doc.pipe(res);

    doc.fontSize(16).text("Liste des membres\n\n");

    const membres = await Membre.find();
    membres.forEach((m) => {
      doc
        .fontSize(12)
        .text(`Nom : ${m.nomComplet}`)
        .text(`Email : ${m.email}`)
        .text(`Téléphone : ${m.telephone}`)
        .text(`Statut : ${m.statut}`)
        .text("-------------------------");
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
