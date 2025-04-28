import { createFileRoute } from "@tanstack/react-router"
import { GatesTable } from "@/components/tables/gates-table"

export const Route = createFileRoute("/gates")({
  component: GatesTable,
})
