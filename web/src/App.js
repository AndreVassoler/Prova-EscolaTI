import { useEffect, useState } from 'react';

function App() {
  const [nome, setNome] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [disciplinaNome, setDisciplinaNome] = useState('');
  const [status, setStatus] = useState(null);

  const [itens, setItens] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({
    nome: '',
    cargaHoraria: '',
    dataInicio: '',
    disciplinaNome: '',
    disciplinaId: null,
  });

  const apiBase = 'http://localhost:3000';

  const loadCursos = async () => {
    try {
      const response = await fetch(`${apiBase}/cursos`);
      if (!response.ok) throw new Error('Erro ao carregar cursos');
      const data = await response.json();
      setItens(data || []);
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
    }
  };

  useEffect(() => {
    loadCursos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!nome || !cargaHoraria || !dataInicio || !disciplinaNome) {
      setStatus({ type: 'error', style: { color: 'red' }, message: 'Preencha todos os campos.' });
      return;
    }

    try {
      // Criar curso
      const cursoAtributo = {
        nome,
        cargaHoraria: Number(cargaHoraria),
        dataInicio: new Date(dataInicio),
      };

      const cursoResponse = await fetch(`${apiBase}/cursos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cursoAtributo),
      });
      if (!cursoResponse.ok) {
        const text = await cursoResponse.text();
        throw new Error(text || 'Erro para criar');
      }
      const curso = await cursoResponse.json();

      // Criar disciplina 
      const disciAtributo = { nome: disciplinaNome, cursoId: Number(curso.id) };
      const discResponse = await fetch(`${apiBase}/disciplina`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(disciAtributo),
      });
      if (!discResponse.ok) {
        const text = await discResponse.text();
        throw new Error(text || 'Erro para criar');
      }

      setStatus({ type: 'success', message: 'Curso Criado' });
      setNome('');
      setCargaHoraria('');
      setDataInicio('');
      setDisciplinaNome('');

      await loadCursos();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  const startEdit = (curso) => {
    const primeiraDisc = (curso.disciplinas && curso.disciplinas[0]) || null;
    setEditId(curso.id);
    setEditValues({
      nome: curso.nome ?? '',
      cargaHoraria: String(curso.cargaHoraria ?? ''),
      dataInicio: (curso.dataInicio ?? '').slice(0, 10),
      disciplinaNome: primeiraDisc?.nome ?? '',
      disciplinaId: primeiraDisc?.id ?? null,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValues({
      nome: '',
      cargaHoraria: '',
      dataInicio: '',
      disciplinaNome: '',
      disciplinaId: null,
    });
  };

  const saveEdit = async (cursoId) => {
    try {
      // Atualizar curso
      const cursoResponse = await fetch(`${apiBase}/cursos/${cursoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: editValues.nome,
          cargaHoraria: Number(editValues.cargaHoraria),
          dataInicio: new Date(editValues.dataInicio),
        }),
      });
      if (!cursoResponse.ok) {
        const text = await cursoResponse.text();
        throw new Error(text || 'Erro para atualizar');
      }

      if (editValues.disciplinaId) {
        const discResponse = await fetch(`${apiBase}/disciplina/${editValues.disciplinaId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: editValues.disciplinaNome }),
        });
        if (!discResponse.ok) {
          const text = await discResponse.text();
          throw new Error(text || 'Erro para atualizar');
        }
      } else if (editValues.disciplinaNome) {
        const createDisc = await fetch(`${apiBase}/disciplina`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: editValues.disciplinaNome, cursoId }),
        });
        if (!createDisc.ok) {
          const text = await createDisc.text();
          throw new Error(text || 'Erro para criar');
        }
      }

      setStatus({ type: 'success', message: 'Curso Atualizado' });
      cancelEdit();
      await loadCursos();
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
    }
  };

  const deleteItem = async (cursoId) => {
    try {
      const res = await fetch(`${apiBase}/cursos/${cursoId}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Erro para excluir');
      }
      setStatus({ type: 'success', message: 'Curso Excluído' });
      await loadCursos();
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
    }
  };

  // excluir disciplina
  const deleteDisciplina = async (disciplinaId) => {
    try {
      const res = await fetch(`${apiBase}/disciplina/${disciplinaId}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Erro ao excluir');
      }
      setStatus({ type: 'success', message: 'Disciplina Excluída' });
      await loadCursos();
    } catch (e) {
      setStatus({ type: 'error', message: e.message });
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Criar Curso</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Nome do Curso"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="number"
            placeholder="Carga Horária"
            value={cargaHoraria}
            onChange={(e) => setCargaHoraria(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
          <input
            type="date"
            placeholder="Data de início"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Nome da Disciplina"
            value={disciplinaNome}
            onChange={(e) => setDisciplinaNome(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Adicionar</button>
      </form>

      {status && (
        <p style={{ marginTop: 12, color: status.type === 'error' ? 'crimson' : 'green' }}>
          {status.message}
        </p>
      )}

      <hr style={{ margin: '24px 0' }} />

      <h3>Lista de Cursos</h3>
      <div style={{ display: 'grid', gap: 12 }}>
        {itens.map((curso) => {
          const primeiraDisc = (curso.disciplinas && curso.disciplinas[0]) || null;
          const isEditing = editId === curso.id;

          if (isEditing) {
            return (
              <div key={curso.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={editValues.nome}
                    onChange={(e) => setEditValues(v => ({ ...v, nome: e.target.value }))}
                    placeholder="Nome do curso"
                    style={{ flex: 2, padding: 8 }}
                  />
                  <input
                    type="number"
                    value={editValues.cargaHoraria}
                    onChange={(e) => setEditValues(v => ({ ...v, cargaHoraria: e.target.value }))}
                    placeholder="Carga horária"
                    style={{ flex: 1, padding: 8 }}
                  />
                  <input
                    type="date"
                    value={editValues.dataInicio}
                    onChange={(e) => setEditValues(v => ({ ...v, dataInicio: e.target.value }))}
                    placeholder="Data de início"
                    style={{ flex: 1, padding: 8 }}
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="text"
                    value={editValues.disciplinaNome}
                    onChange={(e) => setEditValues(v => ({ ...v, disciplinaNome: e.target.value }))}
                    placeholder="Nome da disciplina"
                    style={{ width: '100%', padding: 8 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ cursor: 'pointer' }} type="button" onClick={() => saveEdit(curso.id)}>Salvar</button>
                  <button style={{ cursor: 'pointer' }} type="button" onClick={cancelEdit}>Cancelar</button>
                </div>
              </div>
            );
          }

          return (
            <div key={curso.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
              <div style={{ fontWeight: 600 }}>{curso.nome}</div>
              <div style={{ color: '#555' }}>
                Carga horária: {curso.cargaHoraria} | Início: {(curso.dataInicio || '').slice(0, 10)}
              </div>
              <div style={{ marginTop: 4 }}>
                Disciplina: {primeiraDisc ? (
                  <>
                    {primeiraDisc.nome}
                    <button
                      type="button"
                      style={{ marginLeft: 8, color: 'crimson', border: 'none', background: 'none', cursor: 'pointer' }}
                      title="Excluir disciplina"
                      onClick={() => deleteDisciplina(primeiraDisc.id)}
                    >
                      Excluir Disciplina
                    </button>
                  </>
                ) : '—'}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button style={{ cursor: 'pointer' }} type="button" onClick={() => startEdit(curso)}>Editar</button>
                <button style={{ cursor: 'pointer' }} type="button" onClick={() => deleteItem(curso.id)}>Excluir</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;