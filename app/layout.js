import './globals.css'

export const metadata = {
  title: 'Yaoyao 3D - Cyber Cat',
  description: 'Made by alkorgli',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden">{children}</body>
    </html>
  )
}
