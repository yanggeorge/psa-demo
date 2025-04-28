import { createFileRoute } from "@tanstack/react-router"
import { BasicEventsTable } from "@/components/tables/basic-events-table"

export const Route = createFileRoute("/basic-events")({
  component: BasicEventsTable,
})
