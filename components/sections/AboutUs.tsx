/**
 * components/sections/AboutUs.tsx
 *
 * "De la terminal al mundo" — historia y contexto de la agencia.
 * Layout de dos columnas: imagen a la izquierda, texto a la derecha.
 * En mobile, la imagen aparece primero (orden visual natural).
 */
import Image from "next/image";


export function AboutUs() {
  return (
    <section className="bg-[#f9f9f9]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-12 md:items-center md:gap-12">
        {/* La clase `group` en el contenedor permite que los hijos usen `group-hover:*`
            para reaccionar al hover del padre — en este caso, la imagen escala al
            hacer hover sobre el contenedor completo, no solo sobre la imagen. */}
        <div className="group overflow-hidden rounded-2xl shadow-md shadow-[#0b4058]/10 md:col-span-5">
          <Image
            src="/nosotros.png"
            alt="Equipo de 787 Rumbos — agencia de viajes en el Aeropuerto de Córdoba"
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, 42vw"
            className="h-[300px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] md:h-[420px]"
          />
        </div>
        <div className="md:col-span-7 md:pl-4">
          <h2 className="font-[family-name:var(--font-elaine)] text-3xl font-bold tracking-tight md:text-4xl">
            De la terminal al mundo
          </h2>
          <p className="mt-5 max-w-2xl text-[1.03rem] leading-relaxed text-[#0b4058]/80">
            Llevamos años dedicados al rubro del transporte y el turismo. Conocemos lo que
            significa viajar porque lo vivimos todos los días desde nuestro local en el
            aeropuerto. Decidimos abrir 787 Rumbos para ir un paso más allá y ofrecer a nuestros
            pasajeros el acompañamiento total que siempre quisimos darles.
          </p>
        </div>
      </div>
    </section>
  );
}
