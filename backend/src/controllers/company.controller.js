
const CompanyModel = require("../models/company.model");

exports.createCompany = (req, res) => {
  try {
    const { name, nit, address, phone } = req.body;
    if (!name || !nit) return res.status(400).json({ error: "Faltan datos requeridos" });
    const company = CompanyModel.create({ name, nit, address, phone });
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCompanies = (req, res) => {
  try {
    const data = CompanyModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCompanyById = (req, res) => {
  try {
    const company = CompanyModel.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Empresa no encontrada" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCompany = (req, res) => {
  try {
    const updated = CompanyModel.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCompany = (req, res) => {
  try {
    const result = CompanyModel.delete(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
