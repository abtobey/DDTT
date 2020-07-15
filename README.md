# DDTT

##Overview

This is a simulation of a dual density tilt tray sorter operating under ideal conditions. Tilt Tray sorters are used in the logistics industry by high volume shippers to sort packages must faster and with higher accuracy than a human. They work by placing packages on a rotating carousel which drops the package into a chute based on the destination of the package. A dual density tilt tray has two sets of trays on the carousel, one which can drop on the outside loop of the sorter and one on the inside. This tool simulates the throughput of the sorter based on various factors by replicating the logic of the machine. 

The following attributes are adjustable:

Time span to simulate

Sweepers per line- A sweeper is the person who removes the sacks from the chutes when they are full. For this simulation, we assume all chutes have sacks which can hold 35 pieces, and that a sweeper can change 50 sacks per hour. If a chute is full, the sorter will not drop the package in the chute and it will stay on the tray, decreasing the potential throughput.

Inductors per platform per side- An inductor is the person who places packages on the trays. The inductors are grouped together, typically in groups of 4 or 5. for a dual density tilt tray, the inside and outside loops have their own sets of inductors.

No Read percentage- this is the percentage of packages which the machine will not be able to read due to bad barcodes. The simulation assigns these via random number generator. These go into a reject chute

Sorter Type- There are three types of sorters covered. 
    -Two induct platforms (one per side). Each piece should have a destination to drop before it comes back around to the induct platform, unless the chute is full. 
    -Four induct platforms with direct feeds. In this case, each platform feeds a line of the sorter and is already split. For example, an outside platform would only have packages going to chutes 101-164. Each piece should have a destination to drop before it comes around to the other induct platform, unless the chute is full. 
    -Four induct platforms with flow splitters. In this case, the pieces are only split between outside (lines 1 and 4) and inside(lines 2 and 3). Therefore, 50% of pieces will pass by the other induct platform on the same loop before dropping, lowering the productivity.

