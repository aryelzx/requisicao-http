import { useEffect, useMemo, useState } from 'react';
//TODO Desafio, transferir de fetch para axios
import './App.css';
const BASE_URL = "https://jsonplaceholder.typicode.com/posts/"
const menu = [
  {
    label: "Introduction",
    id: "1",
  },
  {
    label: "Aula 2",
    id: "2",
  },
  {
    label: "Aula 3",
    id: "3",
  },
  {
    label: "Aula 4",
    id: "not-found",
  },
];

interface Data {
  userId: string;
  id: string;
  title: string;
  body: string;
}

function App() {
  const [currentId, setCurrentId] = useState<null | string>(null)
  const [data, setData] = useState<null | Data>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    if (!currentId) return

    const controller = new AbortController()
    const signal = controller.signal;

    const url = `${BASE_URL}${currentId}`
    setLoading(true)
    setError(null)
    fetch(url, { signal, cache: 'no-cache' })
      .then(async (res) => {
        if (res.status >= 200 && res.status < 300) {
          const data = await res.json()
          setData(data)
        } else {
          setError(String(res.status) + ' Não foi possível carregar o conteúdo')
        }
        setLoading(false)
      })
    return () => {
      controller.abort()
    }
  }, [currentId])

  //seta o caption com o label do menu que tem o mesmo id do currentId
  const caption = useMemo(() => {
    return menu.find(({ id }) => id === currentId)?.label || 'Conteúdo';
  }, [currentId])

  return (
    <div className="app">
      <aside className="app-menu">
        <ul>
          {menu.map(({ label, id }) => (
            <li key={id} onClick={() => setCurrentId(id)}> {/* transforma cada current em um id único */}
              <a className={currentId === id ? 'active' : undefined}>{label}</a>
            </li>
          ))}
        </ul>
      </aside>
      <main className="app-content">
        {
          error ? (
            <div>
              <p>{error}</p> &nbsp;
              <p>Caso o erro persista, entre em contato com o suporte</p>
            </div>
          ) :
            loading ? (
              <p>Carregando...</p>
            ) :
              data ? (
                <div className="app-content__header" >
                  <small className="app-content__caption">{caption}</small>
                  <h1>{data.title}</h1>
                  <p>{data.body}</p>
                </div>
              ) : !currentId ? (
                <div>
                  <h1>Bem vindo!</h1>
                  <p>Selecione um item do menu</p>
                </div>
              ) : (
                <p>Conteúdo não foi carregado</p>
              )
        }
      </main >
    </div >
  )
}

export default App
