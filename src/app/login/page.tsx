'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/client'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

async function handleLogin() {
  setLoading(true)
  setError('')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    setError('Correo o contraseña incorrectos')
    setLoading(false)
    return
  }

  router.refresh()
  const params = new URLSearchParams(window.location.search)
  router.push(params.get('next') ?? '/admin/core/dashboard')
}

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h5" sx ={{fontWeight: "bold"}}>
          Admin Panel
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Correo"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <Button
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Entrar'}
        </Button>
      </Box>
    </Box>
  )
}