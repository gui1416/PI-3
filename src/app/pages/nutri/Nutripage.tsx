'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { ModeToggle } from "@/components/ui/theme-setting"
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

// Login form schema
const loginSchema = z.object({
  email: z.string()
    .email({ message: 'Email inválido' }),
  senha: z.string()
    .min(1, { message: 'Senha é obrigatória' })
})

// Registration form schema
const registerSchema = z.object({
  name: z.string()
    .min(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  crn: z.string()
    .regex(/^\d{6}$/, { message: 'CRN deve conter 6 dígitos' }),
  email: z.string()
    .email({ message: 'Email inválido' }),
  senha: z.string()
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
    .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número' })
})

type TLoginSchema = z.infer<typeof loginSchema>
type TRegisterSchema = z.infer<typeof registerSchema>

export function AccountPassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('account')

  // Login form
  const loginForm = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: ''
    }
  })

  // Registration form
  const registerForm = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      crn: '',
      email: '',
      senha: ''
    }
  })

  // Handle login submission
  async function handleLogin(data: TLoginSchema) {
    try {
      setIsLoading(true)

      const response = await axios.post('/api/login', data)

      if (response.status === 200) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Você será redirecionado para o dashboard."
        })

        // Redirect to dashboard after successful login
        router.push('/dashboard')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: error.response?.data?.message || "Email ou senha incorretos"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle registration submission
  async function handleRegister(data: TRegisterSchema) {
    try {
      setIsLoading(true)

      const response = await axios.post('/api/register-nutricionista', data)

      if (response.status === 201) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Você pode fazer login agora."
        })

        // Switch to login tab after successful registration
        setActiveTab('account')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: error.response?.data?.message || "Ocorreu um erro ao realizar o cadastro"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollArea>
      <div className="absolute top-2 right-2"><ModeToggle /></div>
      <div className="w-full h-screen flex items-center justify-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Conectar-se</TabsTrigger>
            <TabsTrigger value="password">Cadastrar-se</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Coloque seu e-mail e senha para entrar.
                </CardDescription>
              </CardHeader>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                  <CardContent className="space-y-2">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <CardDescription>
                      Caso você não seja um nutricionista clique em <Link className="text-primary hover:underline" href='/'>voltar.</Link>
                    </CardDescription>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Cadastrar-se</CardTitle>
                <CardDescription>
                  Insira aqui suas informações para criar sua conta.
                </CardDescription>
              </CardHeader>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                  <CardContent className="space-y-2">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="crn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CRN</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite seu CRN" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Digite seu e-mail" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Escolha uma senha" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Cadastrando...' : 'Salvar'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}