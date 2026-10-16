import { HeroSection } from '../components/home/HeroSection';
import { CursoSection } from '../components/home/CursoSection';
import { StatsSection } from '../components/home/StatsSection';
import { LideresSection } from '../components/home/LideresSection';
import { CoordenadoresSection } from '../components/home/CoordenadoresSection';
import { GaleriaSection } from '../components/home/GaleriaSection';
import { ProjetosSection } from '../components/home/ProjetosSection';
import { StackSection } from '../components/home/StackSection';
import { ContatoSection } from '../components/home/ContatoSection';
import { MascoteSection } from '../components/mascote/MascoteSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CursoSection />
      <StatsSection />
      <LideresSection />
      <CoordenadoresSection />
      <GaleriaSection />
      <ProjetosSection />
      <StackSection />
      <ContatoSection />
      <MascoteSection />
    </main>
  );
}