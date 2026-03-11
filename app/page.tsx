import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- NAVBAR (Sticky & Blur Effect) --- */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-white/80 px-6 py-4 backdrop-blur-md shadow-sm border-b border-blue-100 md:px-16 lg:px-24">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-700 text-xl font-bold text-white shadow-lg shadow-blue-500/30">
            💧
          </div>
          <span className="text-xl font-extrabold tracking-tight text-blue-950">
            PDAM<span className="text-blue-600">Makmur</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/Sign-In" 
            className="hidden sm:block text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
          >
            Sign In
          </Link>
          <Link 
            href="/Sign-Up" 
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/40"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* --- HERO SECTION (Gradient Background) --- */}
      <main className="relative flex flex-col items-center justify-center bg-linear-to-b from-blue-50 via-white to-white px-6 pt-24 pb-20 text-center md:px-16 lg:px-24 md:pt-32 md:pb-24">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-1/2 -z-10 h-125 w-125 -translate-x-1/2 rounded-full bg-blue-400/20 blur-[100px]"></div>

        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
          Sistem Informasi Manajemen Air Terpadu
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
          Akses Air Bersih <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
            Lebih Mudah & Transparan
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
          Kelola tagihan, ajukan pemasangan baru, dan pantau penggunaan air Anda langsung dari satu *dashboard*. Pelayanan responsif untuk kenyamanan keluarga Anda.
        </p>
        
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/Sign-Up"
            className="flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 hover:bg-blue-500"
          >
            Mulai Sekarang Juga
          </Link>
          <Link
            href="#layanan"
            className="flex items-center justify-center rounded-full px-8 py-4 text-base font-bold text-slate-700 ring-1 ring-inset ring-slate-200 bg-white transition-all hover:bg-slate-50 hover:ring-slate-300"
          >
            Lihat Layanan
          </Link>
        </div>
      </main>

      {/* --- FITUR SECTION (Grid Cards) --- */}
      <section id="layanan" className="px-6 py-16 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Layanan Unggulan Kami</h2>
          <p className="mt-4 text-slate-600">Kemudahan dalam satu genggaman untuk seluruh pelanggan PDAM.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-100">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              💳
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">Cek Tagihan Instan</h3>
            <p className="text-slate-600 leading-relaxed">Pantau rincian pemakaian air dan tagihan bulanan Anda secara *real-time* tanpa perlu datang ke kantor.</p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-100">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-3xl group-hover:bg-cyan-500 group-hover:text-white transition-colors">
              🛠️
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">Lapor Gangguan</h3>
            <p className="text-slate-600 leading-relaxed">Pipa bocor atau air mati? Laporkan keluhan Anda dengan cepat dan pantau status perbaikannya.</p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-100">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-3xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              📝
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">Pemasangan Baru</h3>
            <p className="text-slate-600 leading-relaxed">Ajukan permintaan sambungan pipa baru untuk rumah atau bisnis Anda melalui formulir pendaftaran *online*.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="mt-auto border-t border-slate-100 bg-slate-50 py-8 px-6 text-center text-sm text-slate-500 md:px-16">
        <p>&copy; {new Date().getFullYear()} PDAM Makmur. Proyek Tugas Sistem Manajemen Perusahaan Air Minum.</p>
      </footer>

    </div>
  );
}