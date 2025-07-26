NetLogo 6.4.0 
; Building Site Swimming Pool and Gym Simulation
; Author: ChatGPT
; Date: 25 July 2025
;
; This NetLogo model represents the typical 24-hour usage and occupancy
; profile of a small construction site that is approximately half way
; through the build of an indoor swimming pool and adjacent gym.  Each
; tick in the simulation corresponds to a single minute of real time,
; so a complete day is 1\u202f440 ticks.  Workers arrive in the morning,
; take a lunch break, resume work in the afternoon and depart in the
; evening.  Delivery vehicles periodically enter the site to drop off
; materials.  The model tracks occupancy in each zone (pool area,
; gym area, break area and walkways) so that plots and monitors can
; display how busy different parts of the site are throughout the day.

extensions []

;; turtles-own and breed declarations
breed [workers worker]
workers-own [
  role           ;; "pool", "gym" or "guard"
  state          ;; "working" or "break"
]

breed [vehicles vehicle]
vehicles-own [
  target-area      ;; "pool" or "gym"
  remaining-time   ;; countdown until departure (in minutes)
]

globals [
  ;; current time in minutes from midnight (0\u20131439)
  current-time
  ;; number of construction workers scheduled for the shift
  num-workers
  ;; log lists recording occupancy over time (for optional plots)
  pool-occupancy
  gym-occupancy
  break-occupancy
  walkway-occupancy
]

;;; SETUP PROCEDURES

to setup
  clear-all
  set current-time 360           ;; start the simulation at 06:00 (6\u00a0AM)
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
    if pxcor > 0 and pycor > 0 [
      set area-type "pool"
      set pcolor cyan - 2
    ]
    if pxcor > 0 and pycor < 0 [
      set area-type "gym"
      set pcolor yellow + 3
    ]
    if pxcor < 0 and pycor > 0 [
      set area-type "break"
      set pcolor green + 1
    ]
    if pxcor < 0 and pycor < 0 [
      set area-type "storage"
      set pcolor gray + 2
    ]
    if area-type = "" [
      set area-type "walkway"
      set pcolor gray - 1
    ]
  ]
end

;; create workers at the start of the shift.  Assign each worker a
;; random role \u2013 roughly half will work on the pool and half on the
;; gym.  They appear at the entrance and immediately walk to their
;; designated zone.

to setup-workers
  create-workers num-workers [
    set breed workers
    set role (ifelse-value random 2 = 0 ["pool"] ["gym"])
    set state "working"
    move-to entrance-patch
  ]
  ;; add a night\u2011shift guard so there is always one worker present
  create-workers 1 [
    set breed workers
    set role "guard"
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
  ;; end the simulation at midnight (24\u00a0\u00d7\u00a060 minutes)
  if current-time >= 1440 [ stop ]

  ;; handle scheduled events
  if current-time = 720 [
    ask workers with [role != "guard"] [ set state "break" ]
  ]
  if current-time = 780 [
    ask workers with [role != "guard"] [ set state "working" ]
  ]

  ;; randomly create delivery vehicles.  On average one delivery
  ;; arrives every two hours.  Vehicles choose a target area at random
  ;; and remain parked for 30\u201160 minutes once they arrive.
  maybe-spawn-delivery

  ask workers [ perform-work ]
  ask vehicles [ perform-delivery ]

  ;; log occupancy for optional plots
  set pool-occupancy lput (count workers with [ [area-type] of patch-here = "pool" ]) pool-occupancy
  set gym-occupancy lput (count workers with [ [area-type] of patch-here = "gym" ]) gym-occupancy
  set break-occupancy lput (count workers with [ [area-type] of patch-here = "break" ]) break-occupancy
  set walkway-occupancy lput (count workers with [ [area-type] of patch-here = "walkway" ]) walkway-occupancy

  set current-time current-time + 1
  tick
end

;;; WORKER BEHAVIOUR

;; workers perform patrols, breaks and work according to their role.
;; security guard patrols walkways all night.

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

;;; VEHICLE BEHAVIOUR

;; randomly create delivery vehicles (see go procedure)

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

;; for each tick, vehicles move towards their target area; once there
;; they wait the specified number of minutes then leave the site.

to perform-delivery  ;; turtle procedure
  if remaining-time <= 0 [ die stop ]
  ifelse [area-type] of patch-here = target-area [
    set remaining-time remaining-time - 1
  ] [
    go-to-zone target-area
  ]
end

;;; MOVEMENT HELPERS

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

; The four occupancy lists (pool\u2011occupancy, gym\u2011occupancy, break\u2011occupancy
; and walkway\u2011occupancy) are logged once per tick in the `go` procedure.
; Users may plot these lists with separate pens to visualise how busy
; each zone is over a virtual day.

;;; EXTENDING THE MODEL

; Add CO\u2082 concentration patches to couple IAQ with worker productivity …

;;; CREDITS AND REFERENCES

; Built on Railsback & Grimm (2019) ABM patterns; funding by …

@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
