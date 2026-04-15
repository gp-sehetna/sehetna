"use client"

import { FormInputField } from "@/components/ui/forms/inputs/FormInputField"
import { Badge } from "@/components/ui/shadcn/badge"
import { Button } from "@/components/ui/shadcn/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Label } from "@/components/ui/shadcn/label"
import { Separator } from "@/components/ui/shadcn/separator"
import { Slider } from "@/components/ui/shadcn/slider"
import { Switch } from "@/components/ui/shadcn/switch"
import { IEnvironmentData } from "@/features/environment/week/week.dto"
import { EnvironmentDataSchema } from "@/features/environment/week/week.validation"
import { cn, formatCoords } from "@/lib/utils"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import {
    Calendar,
    DollarSign,
    Droplets,
    Flame,
    Globe2,
    MapPin,
    Thermometer,
    TrendingDown,
    Waves,
    Wheat,
    Wind,
    X,
} from "lucide-react"
import { Controller, useFieldArray, useForm } from "react-hook-form"

const FieldRow = ({
    label,
    icon: Icon,
    error,
    children,
    unit,
    color,
}: {
    label: string
    icon?: React.ElementType
    error?: string
    children: React.ReactNode
    unit?: string
    color?: string
}) => (
    <div className="space-y-1.5">
        <div className="flex items-center justify-between">
            <Label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
            </Label>
            {unit && (
                <div className="glassy text-muted-foreground flex items-center justify-center gap-2 rounded px-1.5">
                    <small>{unit}</small>
                    {color && <span className={cn(color, "h-2 w-2 rounded-sm")}></span>}
                </div>
            )}
        </div>
        {children}
        {error && <small className="text-destructive">{error}</small>}
    </div>
)

const SliderField = ({
    label,
    icon,
    unit,
    min,
    max,
    step = 1,
    value,
    onChange,
    color,
    error,
}: {
    label: string
    icon?: React.ElementType
    unit?: string
    min: number
    max: number
    step?: number
    value: number | null | undefined
    color?: string
    onChange: (v: number) => void
    error?: string
}) => {
    const fixedValue = value?.toFixed(2)
    const fixedUnit =
        unit && fixedValue ? `${fixedValue} ${unit}` : unit ? unit : fixedValue ? fixedValue : "-"
    return (
        <FieldRow label={label} icon={icon} color={color} error={error} unit={fixedUnit}>
            <Slider
                min={min}
                max={max}
                showRange
                step={step}
                value={[Number(fixedValue ?? min)]}
                onValueChange={([v]) => onChange(v)}
                className="flex-1"
            />
        </FieldRow>
    )
}

type MapModifyInputsProps = {
    onSubmitForm: (data: IEnvironmentData) => void
}

const MapModifyInputs = ({ onSubmitForm }: MapModifyInputsProps) => {
    const setModifying = usePredictionsStore((s) => s.setModifying)
    const environment = usePredictionsStore((s) => s.environment)
    const setEnvironment = usePredictionsStore((s) => s.setEnvironment)

    const form = useForm<IEnvironmentData>({
        resolver: zodResolver(EnvironmentDataSchema),
        defaultValues: environment ?? undefined,
    })

    const { fields } = useFieldArray({ control: form.control, name: "data" })

    if (!environment) return null

    const [lat, lng] = formatCoords(environment.coords)
    const weekly = environment.data[0]

    const onSubmit = (data: IEnvironmentData) => {
        setEnvironment(data)
        onSubmitForm(data)
        setModifying(false)
    }

    return (
        <form
            id="simulation-modify-form"
            className="flex w-full flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
        >
            {/* ── Header bar ── */}
            <div className="glassy flex items-center justify-between rounded-2xl pl-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-2 w-2">
                        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <span className="text-sm font-semibold tracking-tight">Scenario Editor</span>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => setModifying(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* ── Location Info ── */}
            <Card className="glassy border-dashed bg-transparent">
                <CardContent className="p-4">
                    <div className="grid grid-cols-3 text-center">
                        <div className="space-y-0.5">
                            <MapPin className="text-muted-foreground mx-auto h-3.5 w-3.5" />
                            <p className="text-muted-foreground font-mono text-[11px]">Coords</p>
                            <p className="text-xs font-medium">
                                {lat} <br /> {lng}
                            </p>
                        </div>
                        <div className="space-y-0.5">
                            <Globe2 className="text-muted-foreground mx-auto h-3.5 w-3.5" />
                            <p className="text-muted-foreground font-mono text-[11px]">Country</p>
                            <Badge variant="glassy" className="text-[11px]">
                                {environment.country_code}
                            </Badge>
                        </div>
                        <div className="space-y-0.5">
                            <Calendar className="text-muted-foreground mx-auto h-3.5 w-3.5" />
                            <p className="text-muted-foreground font-mono text-[11px]">Week of</p>
                            <p className="text-xs font-medium">
                                {format(new Date(weekly.date), "EE, d MMM yy")}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Environmental Weekly Data ── */}
            {fields.map((field, i) => (
                <Card key={field.id} className="glassy bg-transparent">
                    <CardHeader className="pt-4 pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Wind className="h-4 w-4 text-sky-400" />
                            Air & Climate
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* PM2.5 */}
                        <Controller
                            control={form.control}
                            name={`data.${i}.pm25_ugm3`}
                            render={({ field: f }) => (
                                <SliderField
                                    label="PM2.5 Concentration"
                                    unit="µg/m³"
                                    min={0}
                                    max={500}
                                    step={0.5}
                                    value={f.value}
                                    onChange={f.onChange}
                                    error={form.formState.errors.data?.[i]?.pm25_ugm3?.message}
                                    color="bg-sky-400"
                                />
                            )}
                        />

                        {/* AQI */}
                        <Controller
                            control={form.control}
                            name={`data.${i}.aqi_pm`}
                            render={({ field: f }) => (
                                <SliderField
                                    label="Air Quality Index (PM)"
                                    unit="AQI"
                                    min={0}
                                    max={500}
                                    value={f.value}
                                    onChange={f.onChange}
                                    error={form.formState.errors.data?.[i]?.aqi_pm?.message}
                                    color={
                                        (f.value ?? 0) < 50
                                            ? "bg-emerald-400"
                                            : (f.value ?? 0) < 150
                                              ? "bg-yellow-400"
                                              : "bg-red-500"
                                    }
                                />
                            )}
                        />

                        <Separator />

                        {/* Temperature */}
                        <Controller
                            control={form.control}
                            name={`data.${i}.temperature_celsius`}
                            render={({ field: f }) => (
                                <SliderField
                                    label="Temperature"
                                    icon={Thermometer}
                                    unit="°C"
                                    min={-50}
                                    max={50}
                                    step={0.1}
                                    value={f.value}
                                    onChange={f.onChange}
                                    error={
                                        form.formState.errors.data?.[i]?.temperature_celsius
                                            ?.message
                                    }
                                    color={(() => {
                                        const temp = f.value ?? 0
                                        if (temp <= -10) return "bg-blue-100" // Snowy
                                        if (temp <= 0) return "bg-blue-500" // Very Cold
                                        if (temp <= 15) return "bg-cyan-600" // Cold
                                        if (temp <= 25) return "bg-green-600" // Normal
                                        if (temp <= 35) return "bg-orange-500" // Hot
                                        return "bg-red-600" // Very Hot
                                    })()}
                                />
                            )}
                        />

                        {/* Precipitation */}
                        <Controller
                            control={form.control}
                            name={`data.${i}.precipitation_mm`}
                            render={({ field: f }) => (
                                <SliderField
                                    label="Precipitation"
                                    icon={Droplets}
                                    unit="mm"
                                    min={0}
                                    max={300}
                                    step={0.5}
                                    value={f.value}
                                    onChange={f.onChange}
                                    error={
                                        form.formState.errors.data?.[i]?.precipitation_mm?.message
                                    }
                                    color="bg-blue-400"
                                />
                            )}
                        />

                        {/* Heat Wave Days */}
                        <Controller
                            control={form.control}
                            name={`data.${i}.heat_wave_days`}
                            render={({ field: f }) => (
                                <FieldRow
                                    label="Heat Wave Days"
                                    icon={Flame}
                                    unit={`${f.value} days/week`}
                                    error={form.formState.errors.data?.[i]?.heat_wave_days?.message}
                                >
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => f.onChange(d)}
                                                className={cn(
                                                    "flex h-8 flex-1 items-center justify-center rounded-lg text-xs font-semibold transition-all",
                                                    f.value === d
                                                        ? "text-background bg-primary shadow-md"
                                                        : "text-muted-foreground hover:bg-background/70 bg-background/40"
                                                )}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </FieldRow>
                            )}
                        />

                        {/* Flood Indicator */}
                        <Controller
                            control={form.control}
                            name={`data.${i}.flood_indicator`}
                            render={({ field: f }) => (
                                <div className="glassy flex items-center justify-between rounded-lg border px-3 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <Waves
                                            className={cn(
                                                "h-4 w-4 transition-colors",
                                                f.value ? "text-blue-500" : "text-muted-foreground"
                                            )}
                                        />
                                        <div>
                                            <p className="text-sm font-medium">Flood Event</p>
                                            <small className="text-muted-foreground">
                                                {f.value
                                                    ? "Active flood reported"
                                                    : "No flood this week"}
                                            </small>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={!!f.value}
                                        onCheckedChange={(v) => f.onChange(v ? 1 : 0)}
                                    />
                                </div>
                            )}
                        />
                    </CardContent>
                </Card>
            ))}

            {/* ── Geogrphic Indicators ── */}
            <Card className="glassy bg-transparent">
                <CardHeader className="pt-4 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                        <Globe2 className="h-4 w-4 text-violet-500" />
                        Geogrphic Indicators
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* GDP */}
                    <FormInputField
                        {...form.register("indicators.gdp_per_capita_usd", {
                            valueAsNumber: true,
                        })}
                        type="number"
                        label="GDP per Capita ($)"
                        placeholder="e.g. 12400$"
                        className="text-sm"
                        prependInnerIcon={<DollarSign />}
                        errors={[form.formState.errors.indicators?.gdp_per_capita_usd]}
                    />

                    {/* Food Production Index */}
                    <Controller
                        control={form.control}
                        name="indicators.food_production_index"
                        render={({ field: f }) => (
                            <SliderField
                                label="Food Production Index"
                                icon={Wheat}
                                min={0}
                                max={200}
                                step={0.5}
                                value={f.value}
                                onChange={f.onChange}
                                error={
                                    form.formState.errors.indicators?.food_production_index?.message
                                }
                                color="bg-amber-400"
                            />
                        )}
                    />

                    {/* Undernourishment */}
                    <Controller
                        control={form.control}
                        name="indicators.undernourishment"
                        render={({ field: f }) => (
                            <SliderField
                                label="Undernourishment"
                                icon={TrendingDown}
                                unit="%"
                                min={0}
                                max={70}
                                step={0.1}
                                value={f.value}
                                onChange={f.onChange}
                                error={form.formState.errors.indicators?.undernourishment?.message}
                                color={
                                    (f.value ?? 0) > 35
                                        ? "bg-red-500"
                                        : (f.value ?? 0) > 15
                                          ? "bg-yellow-400"
                                          : "bg-emerald-400"
                                }
                            />
                        )}
                    />
                </CardContent>
            </Card>
            <div className="glassy sticky bottom-0 flex items-center gap-2 rounded-2xl p-3">
                <Button
                    className="rounded-full"
                    form="simulation-modify-form"
                    variant="glassy"
                    size="xs"
                    onClick={() => form.reset()}
                >
                    Reset
                </Button>
                <Button
                    className="w-full rounded-full"
                    size="xs"
                    type="submit"
                    form="simulation-modify-form"
                >
                    Predict
                </Button>
            </div>
        </form>
    )
}

export default MapModifyInputs
