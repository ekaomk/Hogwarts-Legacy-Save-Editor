import Image from 'next/image'
import { Inter } from '@next/font/google'
import { MyDropzone } from '@/components/Dropzone'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>

      <div className="navbar bg-neutral text-neutral-content">
        <a className="flex-1 normal-case text-xl">Hogwarts Legacy Save Editor</a>
        <div className="flex-none">
          <a className="btn" href='https://github.com/ekaomk/Hogwarts-Legacy-Save-Editor' target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>


      <div className="flex mx-auto justify-center mt-5">
        <MyDropzone />
      </div>

      <footer className="footer items-center p-4 bg-neutral text-neutral-content content-center" style={
        { position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }
      }>
        <div>
          <p>Please backup you save first. I cannot guarantee against the risk of save file corruption.</p>
          <p>The trademark of the Hogwarts Legacy brand and name belongs solely to its rightful owner.</p>
          <p>The Hogwarts Legacy Save Editor has no affiliation, support or official recognition from Avalanche Software or Warner Bros. Games.</p>
          <p>Feel free to contribute at <a className="text-info" href="https://github.com/ekaomk/Hogwarts-Legacy-Save-Editor" target="_blank" rel="noreferrer">GitHub</a></p>
        </div>
      </footer>
      



      <Script type="module" strategy='beforeInteractive' src="/sql-loader.js" />
    </main>
  )
}
