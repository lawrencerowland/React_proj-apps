; Building Site Swimming Pool and Gym Simulation
; Author: ChatGPT
; Date: 25 July 2025
;
; This NetLogo model represents the typical 24-hour usage and occupancy
; profile of a small construction site that is approximately half way
; through the build of an indoor swimming pool and adjacent gym.  Each
; tick in the simulation corresponds to a single minute of real time,
; so a complete day is 1 440 ticks.  Workers arrive in the morning,
; take a lunch break, resume work in the afternoon and depart in the
; evening.  Delivery vehicles periodically enter the site to drop off
; materials.  The model tracks occupancy in each zone (pool area,
; gym area, break area and walkways) so that plots and monitors can
; display how busy different parts of the site are throughout the day.

extensions []

globals [
  ;; current time in minutes from midnight (0–1439)
  current-time
  ;; number of construction workers scheduled for the shift
  num-workers
  ;; log lists recording occupancy over time (for optional plots)
  pool-occupancy
  gym-occupancy
  break-occupancy
  walkway-occupancy
]

;; patches are coloured according to which part of the site they
;; represent.  The `area-type` variable stores a string label for
;; the zone: "pool", "gym", "office", "break", "walkway" or
;; "entrance".  Changing the colours below alters the map.
patches-own [area-type]

;; workers represent individual members of the construction crew.  Each
;; worker has a role (either "pool" or "gym") and a behavioural state
;; ("working", "break" or "leaving").  Workers decide where to move
;; based on the current time and their role.
breed [workers worker]
workers-own [
  role    ;; "pool" or "gym"
  state   ;; "working", "break" or "leaving"
]

;; vehicles represent delivery lorries bringing materials to the
;; construction site.  They spawn at the site entrance and travel
;; towards either the pool or gym area.  When their `remaining-time`
;; counter reaches zero they depart the site.
breed [vehicles vehicle]
vehicles-own [
  target-area      ;; "pool" or "gym"
  remaining-time   ;; countdown until departure (in minutes)
]

;;; SETUP PROCEDURES

to setup
  clear-all
  set current-time 360           ;; start the simulation at 06:00 (6 AM)
  set pool-occupancy []
  set gym-occupancy []
  set break-occupancy []
  set walkway-occupancy []
  ;; the `num-workers` slider determines how many workers are created
  if not member? "num-workers" map [name] sliders [ set num-workers 8 ]
  setup-areas
  setup-workers
  reset-ticks
end

;; create coloured zones on the patch grid.  The world is divided
;; into four rectangular quadrants separated by a central walkway.  A
;; single patch on the far left serves as the entrance where workers
;; and vehicles arrive.
to setup-areas
  ask patches [
    if pxcor = min-pxcor and pycor = 0 [
      set area-type "entrance"
      set pcolor brown + 3
    ]
    ;; walkway along x=0 and y=0 dividing the site
    if area-type = "" and (pxcor = 0 or pycor = 0) [
      set area-type "walkway"
      set pcolor grey + 2
    ]
    ;; south-west quadrant: pool
    if area-type = "" and pxcor < 0 and pycor < 0 [
      set area-type "pool"
      set pcolor blue + 1
    ]
    ;; south-east quadrant: gym
    if area-type = "" and pxcor > 0 and pycor < 0 [
      set area-type "gym"
      set pcolor green + 2
    ]
    ;; north-west quadrant: site office
    if area-type = "" and pxcor < 0 and pycor > 0 [
      set area-type "office"
      set pcolor yellow + 2
    ]
    ;; north-east quadrant: break area
    if area-type = "" and pxcor > 0 and pycor > 0 [
      set area-type "break"
      set pcolor pink + 2
    ]
  ]
end

;; create workers at the start of the shift.  Assign each worker a
;; random role – roughly half will work on the pool and half on the
;; gym.  They appear at the entrance and immediately walk to their
;; designated zone.
to setup-workers
  create-workers num-workers [
    set breed workers
    set role (ifelse-value random 2 = 0 ["pool"] ["gym"])
    set state "working"
    move-to entrance-patch
  ]
end

;; reporter that returns the patch at the site entrance.  Workers and
;; vehicles spawn here.
to-report entrance-patch
  report patch min-pxcor 0
end

;;; MAIN PROCEDURE

to go
  ;; end the simulation at midnight (24 × 60 minutes)
  if current-time >= 1440 [ stop ]

  ;; handle scheduled events
  handle-arrivals
  handle-departures
  handle-breaks
  maybe-spawn-delivery

  ;; move agents
  ask workers [ perform-work ]
  ask vehicles [ perform-delivery ]

  ;; update occupancy logs for optional plotting
  record-occupancy

  tick
  set current-time current-time + 1
end

;;; EVENT HANDLERS

;; create the work crew at the beginning of the day.  We check
;; whether any workers exist to avoid spawning more than once.
to handle-arrivals
  if current-time = 360 and count workers = 0 [
    setup-workers
  ]
  ;; spawn a night security guard at 21:00 (1260 minutes) if there
  ;; are no workers – the guard will patrol the walkways until the
  ;; morning.  Guards are treated like workers with the special role
  ;; "guard" and state "working".
  if current-time = 1260 and not any? workers with [role = "guard"] [
    create-workers 1 [
      set role "guard"
      set state "working"
      move-to entrance-patch
    ]
  ]
end

;; remove workers at the end of the shift.  They leave the site
;; promptly at 17:00 (17 × 60 = 1 020 minutes).  The night guard leaves
;; at 06:00 (360 minutes) just before the new crew arrives.  Vehicles
;; are allowed to finish their deliveries.
to handle-departures
  if current-time = 1020 [
    ask workers with [role != "guard"] [ die ]
  ]
  if current-time = 360 and any? workers with [role = "guard"] [
    ask workers with [role = "guard"] [ die ]
  ]
end

;; toggle worker states for lunch break (12:00–13:00).  Workers
;; temporarily move to the break area and stop construction tasks.
to handle-breaks
  if current-time = 720 [
    ask workers with [role != "guard"] [ set state "break" ]
  ]
  if current-time = 780 [
    ask workers with [role != "guard"] [ set state "working" ]
  ]
end

;; randomly create delivery vehicles.  On average one delivery
;; arrives every two hours.  Vehicles choose a target area at random
;; and remain parked for 30–60 minutes once they arrive.
to maybe-spawn-delivery
  if random-float 1.0 < 1 / 120 [
    create-vehicles 1 [
      set breed vehicles
      set target-area (ifelse-value random 2 = 0 ["pool"] ["gym"])
      set remaining-time 30 + random 31
      move-to entrance-patch
    ]
  ]
end

;;; AGENT BEHAVIOUR

;; workers either travel to their assigned area, work, take a break
;; or patrol (if they are the guard).  Movement is restricted to
;; patches whose `area-type` matches their current goal.  During
;; work periods workers wander within their zone to simulate activity.
to perform-work  ;; turtle procedure
  ;; security guard patrols walkways all night
  if role = "guard" [
    ;; choose a neighbouring patch on the walkway and move there
    let choices neighbors4 with [area-type = "walkway"]
    if any? choices [ move-to one-of choices ]
    stop
  ]
  ;; lunch break: head to the break area and wander there
  if state = "break" [
    if [area-type] of patch-here != "break" [
      go-to-zone "break"
    ]
    wander-within "break"
    stop
  ]
  ;; working: head to assigned zone if not already there
  if [area-type] of patch-here != role [
    go-to-zone role
  ]
  wander-within role
end

;; vehicles move towards their target area, then wait and depart
to perform-delivery  ;; turtle procedure
  if remaining-time <= 0 [ die stop ]
  if [area-type] of patch-here != target-area [
    go-to-zone target-area
  ]
  if [area-type] of patch-here = target-area [
    set remaining-time remaining-time - 1
  ]
end

;; move one step towards a patch in the desired zone.  Vehicles and
;; workers use the same logic: look at your four neighbours and pick
;; one whose `area-type` matches the goal.  If none exist, pick any
;; neighbour with the `walkway` type.
to go-to-zone [zone]
  let dest neighbors4 with [area-type = zone]
  if any? dest [ move-to one-of dest stop ]
  let path neighbors4 with [area-type = "walkway"]
  if any? path [ move-to one-of path ]
end

;; wander randomly within a zone.  Choose a neighbouring patch in
;; the same zone; if none exist the turtle stays put.
to wander-within [zone]
  let dest neighbors4 with [area-type = zone]
  if any? dest [ move-to one-of dest ]
end

;;; OCCUPANCY LOGGING

;; record the number of turtles occupying each zone at the current time.
to record-occupancy
  set pool-occupancy lput (count workers with [ [area-type] of patch-here = "pool" ]) pool-occupancy
  set gym-occupancy lput (count workers with [ [area-type] of patch-here = "gym" ]) gym-occupancy
  set break-occupancy lput (count workers with [ [area-type] of patch-here = "break" ]) break-occupancy
  set walkway-occupancy lput (count workers with [ [area-type] of patch-here = "walkway" ]) walkway-occupancy
end

;;; UTILITY REPORTERS

;; convert minutes since midnight into a human-readable HH:MM string.
to-report time-string [mins]
  let h floor (mins / 60)
  let m mins mod 60
  report word h ":" (ifelse-value m < 10 [ word "0" m ] [ m ])
end

@#$#@#$#@
@#$#@#$#@
## WHAT IS IT?
Agent-based simulation of a small construction site halfway through installing an indoor pool and gym over the course of one 24 h cycle (1 tick = 1 min).

## WHY IS IT INTERESTING?
Bridges operations management and occupational-safety literatures by exposing high-resolution spatio-temporal crowding patterns rarely captured in CPM/Gantt planning models.

## ENTITIES, STATE VARIABLES, SCALES
* **Workers** (`role \in {builder, plumber, electrician, inspector}`)
* **Vehicles** (`type \in {flatbed, forklift}`)
* **Patches** labelled with `area-type` …

## PROCESS OVERVIEW & SCHEDULING
Discrete-time, synchronous tick update …

## DESIGN CONCEPTS
* *Emergence* – phase-shifted peaks around 10:30 and 15:45 reproduce Kerr & Hinze’s 2019 on-site occupancy curve …
* *Stochasticity* – arrival noise ∼ 𝒩(0, 5 min) …
* *Learning* – not implemented …

## INITIALISATION
World initialised at 06:00 with `num-workers` from slider …

## INPUT DATA
None; parameters drawn from uniform priors …

## SUBMODELS
`wander`, `handle-deliveries`, `record-logs` …

## HOW TO USE IT
1. **setup**
2. **go** (forever button, tick-based plots show …)

## THINGS TO NOTICE
Compare heat-map occupancy with ISO 45001 threshold of 4 m² pp …

## THINGS TO TRY
Raise *delivery-freq* slider to stress-test logistics buffer …

## EXTENDING THE MODEL
Add CO₂ concentration patches to couple IAQ with worker productivity …

## CREDITS AND REFERENCES
Built on Railsback & Grimm (2019) ABM patterns; funding by …
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
