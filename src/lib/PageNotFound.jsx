import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#07080c] text-[#e7f2f2]">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-7xl font-light text-[#7ee7ea]">404</h1>
                        <div className="h-0.5 w-16 bg-white/20 mx-auto"></div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-white">
                            Page Not Found
                        </h2>
                        <p className="text-[#c5d6d6] leading-relaxed">
                            The page <span className="font-medium text-white">"{pageName}"</span> could not be found in this application.
                        </p>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#072022] bg-[#7ee7ea] border border-[#7ee7ea] rounded-full hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7ee7ea]"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
