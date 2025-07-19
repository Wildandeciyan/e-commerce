// src/pages/index.tsx

import Head from 'next/head';
import { GetServerSideProps } from 'next';

// Definisikan interface untuk struktur data produk dari Fake Store API
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Komponen React untuk Halaman Utama
interface HomePageProps {
  products: Product[];
  error?: string; // Tambahkan properti error jika ada masalah fetching
}

const HomePage: React.FC<HomePageProps> = ({ products, error }) => {
  return (
    <div>
      <Head>
        <title>My E-commerce App</title>
        <meta name="description" content="A simple e-commerce application built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome to Our Store!</h1>

        {error && (
          <p className="text-center text-red-500 text-lg mb-4">
            Error loading products: {error}. Please try again later.
          </p>
        )}

        {products.length === 0 && !error && (
          <p className="text-center text-gray-600 text-lg">No products found.</p>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform transition duration-300 hover:scale-105"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-contain p-4" // object-contain agar gambar tidak terpotong
                />
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                    {product.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-2xl font-bold text-green-700">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const res = await fetch('https://fakestoreapi.com/products');

    if (!res.ok) {
      // Tangani error jika response tidak OK (misal status 404, 500)
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }

    const products: Product[] = await res.json();

    return {
      props: {
        products,
      },
    };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [], // Kirim array kosong jika ada error
        error: error.message, // Kirim pesan error
      },
    };
  }
};

export default HomePage;