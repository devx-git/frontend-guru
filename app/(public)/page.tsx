// app/(public)/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventosActivos } from "@/services/eventos.service";
import Link from "next/link";

export default async function Home() {
  const eventos = await getEventosActivos();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Gana prediciendo <span className="text-blue-600">resultados deportivos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Compra Gurús, haz tus predicciones y gana dinero real con tu conocimiento deportivo
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Comenzar ahora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/eventos">Ver eventos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Eventos Activos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Eventos activos 🔥</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento: any) => (
              <Card key={evento.id}>
                <CardHeader>
                  <CardTitle>{evento.nombre}</CardTitle>
                  <CardDescription>
                    {new Date(evento.fecha).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    +{evento.premio}% potencial
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/eventos/${evento.id}`}>
                      Comprar Gurú
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}