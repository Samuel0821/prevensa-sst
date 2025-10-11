//frontend-web/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Dashboard() {
  const [data, setData] = useState({
    companies: [],
    incidents: [],
    trainings: [],
    documents: [],
  });
  const [filters, setFilters] = useState({
    company_id: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      const [companiesRes, incidentsRes, trainingsRes, documentsRes] =
        await Promise.all([
          api.get("/companies"),
          api.get("/incidents"),
          api.get("/trainings"),
          api.get("/documents"),
        ]);

      let companies = companiesRes.data || [];
      let incidents = incidentsRes.data || [];
      let trainings = trainingsRes.data || [];
      let documents = documentsRes.data || [];

      if (filters.company_id) {
        incidents = incidents.filter(i => i.company_id == filters.company_id);
        trainings = trainings.filter(t => t.company_id == filters.company_id);
        documents = documents.filter(d => d.company_id == filters.company_id);
      }

      if (filters.start_date && filters.end_date) {
        const start = new Date(filters.start_date);
        const end = new Date(filters.end_date);
        incidents = incidents.filter(i => new Date(i.date) >= start && new Date(i.date) <= end);
        trainings = trainings.filter(t => new Date(t.date) >= start && new Date(t.date) <= end);
      }

      setData({ companies, incidents, trainings, documents });
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    }
  };

  // 📊 Datos para gráficos
  const incidentStatusData = [
    { name: "Abiertos", value: data.incidents.filter(i => i.status === "open").length },
    { name: "Cerrados", value: data.incidents.filter(i => i.status === "closed").length },
  ];

  const trainingStatusData = [
    { name: "Pendientes", value: data.trainings.filter(t => t.status === "Pendiente").length },
    { name: "Completadas", value: data.trainings.filter(t => t.status === "Completada").length },
    { name: "Canceladas", value: data.trainings.filter(t => t.status === "Cancelada").length },
  ];

  const COLORS = ["#2563EB", "#16A34A", "#FACC15", "#EF4444"];

  const kpi = {
    companies: data.companies.length,
    incidents: data.incidents.length,
    trainings: data.trainings.length,
    documents: data.documents.length,
    completedTrainings: data.trainings.filter(t => t.status === "Completada").length,
    closedIncidents: data.incidents.filter(i => i.status === "closed").length,
  };

  const exportPDF = () => {
    const dashboard = document.getElementById("dashboard-content");
    html2canvas(dashboard).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Reporte_Dashboard.pdf");
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Control Parental</h2>

      {/* Filtros */}
      <div className="bg-white shadow-sm border rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Empresa</label>
          <select
            className="border-gray-300 border rounded-lg p-2 w-56"
            value={filters.company_id}
            onChange={(e) => setFilters({ ...filters, company_id: e.target.value })}
          >
            <option value="">Todas</option>
            {data.companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Desde</label>
          <input
            type="date"
            className="border-gray-300 border rounded-lg p-2"
            value={filters.start_date}
            onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Hasta</label>
          <input
            type="date"
            className="border-gray-300 border rounded-lg p-2"
            value={filters.end_date}
            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
          />
        </div>

        <button
          onClick={() => setFilters({ company_id: "", start_date: "", end_date: "" })}
          className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600"
        >
          Limpiar
        </button>

        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-auto"
        >
          📄 Exportar PDF
        </button>
      </div>

      {/* Contenido exportable */}
      <div id="dashboard-content">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard title="Empresas" value={kpi.companies} color="bg-blue-600" />
          <KpiCard title="Incidentes" value={kpi.incidents} color="bg-red-500" />
          <KpiCard title="Capacitaciones" value={kpi.trainings} color="bg-yellow-400" />
          <KpiCard title="Documentos" value={kpi.documents} color="bg-green-500" />
        </div>

        {/* Porcentajes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <KpiCard
            title="Incidentes cerrados"
            value={`${Math.round((kpi.closedIncidents / (kpi.incidents || 1)) * 100)}%`}
            color="bg-indigo-600"
          />
          <KpiCard
            title="Capacitaciones completadas"
            value={`${Math.round((kpi.completedTrainings / (kpi.trainings || 1)) * 100)}%`}
            color="bg-teal-600"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border shadow-sm rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Incidentes por estado</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incidentStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {incidentStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border shadow-sm rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Capacitaciones por estado</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trainingStatusData}>
                <Bar dataKey="value" fill="#2563EB" />
                <Tooltip />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, color }) {
  return (
    <div className={`${color} text-white p-5 rounded-lg shadow-sm flex flex-col items-center`}>
      <h4 className="text-sm font-medium opacity-90">{title}</h4>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
