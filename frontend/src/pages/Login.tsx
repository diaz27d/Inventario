import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINTS } from '../config/api'

import '../../css/Login.css'

interface Label {
  id: number;
  title: string;
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [labelInput, setLabelInputs] = useState<Label[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const cargarLabels = async () => {
      try {

        const response = await fetch(
          ENDPOINTS.LABELS
        )

        const data = await response.json()

        setLabelInputs(data ?? [])
      } catch (error) {
        console.error(error)
      }
    }

    cargarLabels()
  }, [])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()
      
      if(data.data){
        alert('Inicio exitoso')
        navigate('/home')
      }else if(data.errors){
        alert('Inicio fallido ' + data.errors[0].message)
      }
    } catch (error) {
      console.error(error)
      alert('Error al iniciar sesión')
    }
  }


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="titulo">
          {labelInput?.[0]?.title}
        </h1>

        <h2 className="subtitulo">
          {labelInput?.[1]?.title}
        </h2>

        <div className="form-group">
          <label>Correo</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  )
}

export default Login