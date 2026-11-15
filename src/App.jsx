import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import Landing from './pages/Landing';
import AirTraffic from './pages/air-traffic/AirTraffic';
import AirTrafficPrivacy from './pages/air-traffic/AirTrafficPrivacy';
import AirTrafficSupport from './pages/air-traffic/AirTrafficSupport';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/air-traffic" element={<AirTraffic />} />
          <Route path="/air-traffic/privacy" element={<AirTrafficPrivacy />} />
          <Route path="/air-traffic/support" element={<AirTrafficSupport />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
