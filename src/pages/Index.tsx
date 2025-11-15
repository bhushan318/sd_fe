import AppLayout from '@/components/studio/AppLayout';
import Canvas from '@/components/studio/Canvas';
import SystemDynamicsSimulator from '@/components/studio/SystemDynamicsSimulator';


const Index = () => {
  return (
    <AppLayout modelName="System Dynamics Studio">
      {/* <Canvas /> */}
      <SystemDynamicsSimulator />

    </AppLayout>
  );
};

export default Index;
