import { View } from 'react-native'

import { AmbientOrb } from './AmbientOrb'

export function SignInDecorations() {
  return (
    <View
      className="absolute inset-0 z-100"
      pointerEvents="none"
    >
      <AmbientOrb
        duration={22000}
        opacity={[0.2, 0.28, 0.22]}
        orbClassName="bg-brand-primary/16 size-72"
        scale={[0.94, 1.06, 0.97]}
        travelX={[-10, 14, -8]}
        travelY={[-8, 16, -12]}
        wrapperClassName="top-16 left-20 right-0 items-center"
      />

      <AmbientOrb
        duration={16000}
        opacity={[0.32, 0.5, 0.36]}
        orbClassName="bg-brand-primary/24 size-64"
        scale={[0.94, 1.08, 0.98]}
        travelX={[-18, 20, -10]}
        travelY={[-10, 18, -14]}
        wrapperClassName="-top-10 -right-16"
      />

      <AmbientOrb
        duration={19000}
        initialProgress={1}
        opacity={[0.24, 0.4, 0.28]}
        orbClassName="border-brand-primary/35 size-64 border-2 bg-transparent"
        scale={[1.02, 0.94, 1]}
        travelX={[16, -22, 12]}
        travelY={[20, -18, 14]}
        wrapperClassName="bottom-28 -left-14"
      />
    </View>
  )
}
