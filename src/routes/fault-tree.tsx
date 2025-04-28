import { createFileRoute } from "@tanstack/react-router"
import { FaultTreeViewer } from "@/components/fault-tree-viewer"

// 示例XML数据
const sampleXmlData = `<?xml version="1.0" encoding="UTF-8"?>
<opsa-mef name="abc">
  <define-fault-tree name="Tree1">
    <define-gate name="And1">
      <label>And1</label>
      <and>
        <event name="House1"/>
        <event name="House2"/>
      </and>
    </define-gate>
  </define-fault-tree>
  <define-fault-tree name="Tree2">
    <define-gate name="Or1">
      <label>Or1</label>
      <or>
        <event name="And1"/>
        <event name="B1"/>
      </or>
    </define-gate>
  </define-fault-tree>
  <model-data>
    <define-basic-event name="B1">
      <label>B1</label>
      <float value="0.01"/>
    </define-basic-event>
    <define-basic-event name="B2">
      <label>B2</label>
      <float value="0.1"/>
    </define-basic-event>
    <define-house-event name="House1">
      <label>House1</label>
      <constant value="true"/>
    </define-house-event>
    <define-house-event name="House2">
      <label>House2</label>
      <constant value="false"/>
    </define-house-event>
  </model-data>
</opsa-mef>`

export const Route = createFileRoute("/fault-tree")({
  component: () => <FaultTreeViewer xmlData={sampleXmlData} initialTreeName="Tree1" />,
})
