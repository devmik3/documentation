import { Handle, HandleProps, Position } from 'reactflow'

export function TargetHandle(props: { top?: number; id: string } & Partial<HandleProps>) {
  return (
    <Handle
      position={Position.Left}
      {...props}
      type="target"
      style={{ top: props.top, backgroundColor: 'white' }}
      className="h-[8px] w-[8px] rounded-full border border-current bg-white"
    />
  )
}
