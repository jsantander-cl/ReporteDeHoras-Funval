import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Filter, Download, AlertCircle } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/common/Spinner';
import api from '../../services/api';

// Tarea 26: Estudiantes con horas pendientes (In-Debt) -> GET /users/in-debt
//
// NOTA: se filtra/ordena/pagina en el cliente porque el backend no confirma
// tener soporte para un parámetro de búsqueda por texto. Como el endpoint
// SÍ pagina con un page_size máximo (pedir uno muy alto, ej. 1000, devuelve
// 422 Unprocessable Entity), acá se traen todas las páginas en tandas de
// SAFE_PAGE_SIZE y se van acumulando antes de filtrar/ordenar/paginar en UI.
const SAFE_PAGE_SIZE = 100; // ajustar si el backend confirma otro máximo permitido
const PAGE_SIZE = 5; // tamaño de página que se muestra en la tabla

const InDebtStudentsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === Filtros ===
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | NO_PROGRESS | IN_PROGRESS
  const [requiredFilter, setRequiredFilter] = useState('ALL'); // ALL | valor numérico de horas requeridas
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const first = await api.get(`/users/in-debt?page=1&page_size=${SAFE_PAGE_SIZE}`);
        let items = first.data?.items ?? [];
        const total = first.data?.total ?? items.length;
        const totalPages = Math.ceil(total / SAFE_PAGE_SIZE);

        if (totalPages > 1) {
          const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
          const responses = await Promise.all(
            remainingPages.map((p) => api.get(`/users/in-debt?page=${p}&page_size=${SAFE_PAGE_SIZE}`))
          );
          responses.forEach((res) => {
            items = items.concat(res.data?.items ?? []);
          });
        }

        if (!cancelled) setAllStudents(items);
      } catch (err) {
        if (!cancelled) {
          const msg = err.response?.data?.detail || 'Error al cargar estudiantes';
          setError(Array.isArray(msg) ? msg.map((m) => m.msg).join(', ') : msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true };
  }, []);

  // Valores de "horas requeridas" que realmente existen en los datos (ej. 40, 60...)
  const requiredHoursOptions = useMemo(() => {
    const values = new Set(allStudents.map((s) => s.required_hours).filter((v) => v != null));
    return [...values].sort((a, b) => a - b);
  }, [allStudents]);

  const filteredAndSorted = useMemo(() => {
    const term = search.trim().toLowerCase();

    let result = allStudents;

    if (term) {
      result = result.filter(
        (s) => s.full_name?.toLowerCase().includes(term) || s.email?.toLowerCase().includes(term)
      );
    }

    if (statusFilter === 'NO_PROGRESS') {
      result = result.filter((s) => (s.approved_hours ?? 0) === 0);
    } else if (statusFilter === 'IN_PROGRESS') {
      result = result.filter((s) => (s.approved_hours ?? 0) > 0 && (s.approved_hours ?? 0) < (s.required_hours ?? 0));
    }

    if (requiredFilter !== 'ALL') {
      result = result.filter((s) => s.required_hours === Number(requiredFilter));
    }

    return [...result].sort((a, b) => (b.missing_hours ?? 0) - (a.missing_hours ?? 0));
  }, [allStudents, search, statusFilter, requiredFilter]);

  const total = filteredAndSorted.length;
  const paged = filteredAndSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const applyFilters = (nextStatus, nextRequired) => {
    setStatusFilter(nextStatus);
    setRequiredFilter(nextRequired);
    setPage(1);
  };

  const resetFilters = () => applyFilters('ALL', 'ALL');

  const hasActiveFilters = statusFilter !== 'ALL' || requiredFilter !== 'ALL';

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Título y Descripción */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0C2340]">Estudiantes con Horas Pendientes</h1>
        <p className="text-slate-500 text-sm mt-1">
          Lista de estudiantes que no han completado sus horas requeridas.
        </p>
      </div>

      {/* Buscador + Acciones */}
      <section className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre o email..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#004B93]/20 focus:border-[#004B93] text-sm shadow-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`flex-1 md:flex-none border px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors ${
              hasActiveFilters
                ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtrar
            {hasActiveFilters && <span className="w-2 h-2 bg-[#004B93] rounded-full"></span>}
          </button>
          <button className="flex-1 md:flex-none bg-[#004B93] hover:bg-[#003870] text-white px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>

          {/* Menú flotante de filtros */}
          {isFilterOpen && (
            <div className="absolute right-0 top-14 w-72 bg-white border border-slate-200 rounded-2xl p-5 shadow-xl z-50 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-bold text-slate-800 text-sm">Filtros Avanzados</h4>
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="text-xs text-[#004B93] font-bold hover:underline">
                    Limpiar
                  </button>
                )}
              </div>

              {/* Estado de horas */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado de Horas</label>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => applyFilters('ALL', requiredFilter)}
                    className={`text-xs py-2 px-3 rounded-lg font-bold border text-left transition-all ${
                      statusFilter === 'ALL' ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => applyFilters('NO_PROGRESS', requiredFilter)}
                    className={`text-xs py-2 px-3 rounded-lg font-bold border text-left transition-all ${
                      statusFilter === 'NO_PROGRESS' ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Sin avance <span className="font-normal text-slate-400">(0 horas aprobadas)</span>
                  </button>
                  <button
                    onClick={() => applyFilters('IN_PROGRESS', requiredFilter)}
                    className={`text-xs py-2 px-3 rounded-lg font-bold border text-left transition-all ${
                      statusFilter === 'IN_PROGRESS' ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    En progreso <span className="font-normal text-slate-400">(iniciaron, no terminan)</span>
                  </button>
                </div>
              </div>

              {/* Por cumplir: volumen de horas requeridas */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Por cumplir (horas requeridas)</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => applyFilters(statusFilter, 'ALL')}
                    className={`text-xs py-2 rounded-lg font-bold border transition-all ${
                      requiredFilter === 'ALL' ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Todas
                  </button>
                  {requiredHoursOptions.map((hours) => (
                    <button
                      key={hours}
                      onClick={() => applyFilters(statusFilter, String(hours))}
                      className={`text-xs py-2 rounded-lg font-bold border transition-all ${
                        requiredFilter === String(hours) ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Chips de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center -mt-2">
          <span className="text-xs font-semibold text-slate-400">Filtros aplicados:</span>
          {statusFilter !== 'ALL' && (
            <span className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              {statusFilter === 'NO_PROGRESS' ? 'Sin avance' : 'En progreso'}
              <button onClick={() => applyFilters('ALL', requiredFilter)} className="text-slate-400 hover:text-slate-600 font-extrabold ml-1">×</button>
            </span>
          )}
          {requiredFilter !== 'ALL' && (
            <span className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              {requiredFilter}h requeridas
              <button onClick={() => applyFilters(statusFilter, 'ALL')} className="text-slate-400 hover:text-slate-600 font-extrabold ml-1">×</button>
            </span>
          )}
        </div>
      )}

      {/* Estados de carga / error */}
      {loading && <Spinner text="Cargando estudiantes..." />}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Tabla (rectangular, sin curvas) */}
      {!loading && !error && (
        <div className="bg-[#F1F5F9] border border-slate-200/60 p-4 overflow-x-auto">
          <table className="w-full text-left border-spacing-y-2 border-separate">
            <thead>
              <tr className="text-slate-400 font-bold text-xs tracking-wider uppercase">
                <th className="px-6 pb-2">Nombre</th>
                <th className="px-6 pb-2">Email</th>
                <th className="px-6 pb-2">Horas Requeridas</th>
                <th className="px-6 pb-2">Horas Aprobadas</th>
                <th className="px-6 pb-2">Horas Faltantes</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((student) => (
                <tr key={student.id} className="bg-white shadow-sm">
                  <td className="px-6 py-4 font-semibold text-slate-700 text-sm">
                    {student.full_name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{student.email}</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-700">{student.required_hours}</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-700">{student.approved_hours}</td>
                  <td className="px-6 py-4 font-mono font-bold text-sm text-red-600">
                    {student.missing_hours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paged.length === 0 && (
            <div className="py-12 text-center text-slate-400 bg-white">
              No hay estudiantes que coincidan con la búsqueda o los filtros aplicados.
            </div>
          )}
        </div>
      )}

      {!loading && !error && total > 0 && (
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
      )}
    </div>
  );
};

export default InDebtStudentsPage;