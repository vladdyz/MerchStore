import Link from 'next/link';
//To conditionally display the "Check out selection" button depending on user auth status
import { useAtom } from 'jotai';
import { isAuthenticatedAtom } from '@/store';

export default function About() {
  const [authenticated] = useAtom(isAuthenticatedAtom);
    return (
      <div>
      <div 
        className="hero min-h-screen bg-base-200 bg-cover bg-center border-2 border-black" 
        style={{ backgroundImage: "url('/lonely.gif')" }}
      >
        <div className="hero-content text-center">
          <div className="max-w-md bg-white bg-opacity-60 rounded-lg border-2 border-yellow-400 p-6">
            <h1 className="text-5xl font-bold">
              <img className="object-cover" src="/2560px-Seneca_College_logo.svg.png" alt="Seneca College Logo"/>
            </h1>
            <p className="py-6 text-sm">Seneca College of Applied Arts and Technology, branded as Seneca Polytechnic since 2023, is a multi-campus public college in the Greater Toronto Area and Peterborough, Ontario, Canada. It offers full-time and part-time programs at the baccalaureate, diploma, certificate, and graduate levels attended primarily by international students, from whom it draws 80 per cent of its tuition revenue. As of June 20, 2024 it's officially expanded to become a retailer of consumer goods, including: clothes, jewelry, and electronics. </p>
            {!authenticated ? (
              <Link href="/login">
                <button className="btn btn-primary">
                  Login to check out our selection
                </button>
              </Link>
            ) : (
              <Link href="/products">
                <button className="btn btn-primary">
                  Check out our selection
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-center">Information about Seneca sourced from wikipedia (https://en.wikipedia.org/wiki/Seneca_Polytechnic), background image by Renew (https://tenor.com/view/lonely-gif-24656671)</p>
      </div>
    );
}
