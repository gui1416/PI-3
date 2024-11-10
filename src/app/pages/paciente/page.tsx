'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type TInfoPaciente = {
 nome: string
 ndata: string
 genero: string
 peso: string
 altura: string
 restricao: string
 anamnese: string
}

export function Formulario() {
 const form = useForm<TInfoPaciente>({
  defaultValues: {
   nome: '',
   ndata: '',
   genero: '',
   peso: '',
   altura: '',
   restricao: '',
   anamnese: ''
  }
 })

 function handleSubmitInfo(data: TInfoPaciente) {
  console.log(data)
 }

 return (
  <ScrollArea>
   <div className="w-full h-screen flex items-center justify-center">
    <Card className="w-full max-w-sm">
     <CardHeader>
      <CardTitle>Cadastro inicial</CardTitle>
      <CardDescription>
       Forneça as informações iniciais do paciente.
      </CardDescription>
     </CardHeader>

     <CardContent>
      <ScrollArea className="h-[440px] w-full pr-4">
       <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmitInfo)}>
         <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
           <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
             <Input placeholder="Digite seu nome" {...field} />
            </FormControl>
           </FormItem>
          )}
         />

         <FormField
          control={form.control}
          name="ndata"
          render={({ field }) => (
           <FormItem>
            <FormLabel>Idade</FormLabel>
            <FormControl>
             <Input placeholder="Digite sua idade" {...field} />
            </FormControl>
           </FormItem>
          )}
         />

         <FormField
          control={form.control}
          name="genero"
          render={({ field }) => (
           <FormItem>
            <FormLabel>Genêro</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
             <FormControl>
              <SelectTrigger>
               <SelectValue placeholder="Qual seu genêro?" />
              </SelectTrigger>
             </FormControl>
             <SelectContent>
              <SelectItem value="Feminino">Feminino</SelectItem>
              <SelectItem value="Masculino">Masculino</SelectItem>
             </SelectContent>
            </Select>
           </FormItem>
          )}
         />

         <FormField
          control={form.control}
          name="peso"
          render={({ field }) => (
           <FormItem>
            <FormLabel>Peso</FormLabel>
            <FormControl>
             <Input placeholder="Digite seu peso" {...field} />
            </FormControl>
           </FormItem>
          )}
         />

         <FormField
          control={form.control}
          name="altura"
          render={({ field }) => (
           <FormItem>
            <FormLabel>Altura</FormLabel>
            <FormControl>
             <Input placeholder="Digite sua altura" {...field} />
            </FormControl>
           </FormItem>
          )}
         />

         <FormField
          control={form.control}
          name="restricao"
          render={({ field }) => (
           <FormItem>
            <FormLabel>Restrições alimentares</FormLabel>
            <FormControl>
             <Input placeholder="Digite qualquer restrição alimentar" {...field} />
            </FormControl>
           </FormItem>
          )}
         />

         <FormField
          control={form.control}
          name="anamnese"
          render={({ field }) => (
           <FormItem>
            <FormLabel>Anamnese</FormLabel>
            <FormControl>
             <Input placeholder="Digite a anamnese do paciente" {...field} />
            </FormControl>
           </FormItem>
          )}
         />
         <Button className="w-full" type="submit">Enviar</Button>
        </form>
       </Form>
      </ScrollArea>
     </CardContent>

     <CardFooter>
      <CardDescription>
       Já tem cadastro? <Link className="text-white" href='/src/components/pages/Account-Password.tsx'>Acesse</Link>
      </CardDescription>
     </CardFooter>
    </Card>
   </div>
  </ScrollArea>
 );
}