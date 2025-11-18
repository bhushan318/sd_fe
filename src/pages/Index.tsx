import AppLayout from '@/components/studio/AppLayout';
import Canvas from '@/components/studio/Canvas';
import SystemDynamicsSimulator from '@/components/studio/SystemDynamicsSimulator';
import { ProjectProvider } from '../context/ProjectContext';


const Index = () => {
  return (
        <ProjectProvider>

    <AppLayout modelName="System Dynamics Studio">
      {/* <Canvas /> */}
      <SystemDynamicsSimulator />

    </AppLayout>
        </ProjectProvider>

  );
};

export default Index;
