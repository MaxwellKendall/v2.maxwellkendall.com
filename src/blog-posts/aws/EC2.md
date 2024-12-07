---
title: Elastic Cloud Compute (EC2)
tags: public, aws, Virtual Machines, Networking

date: '2019-12-09'
---

This AWS Service provides Virtual Machines (or dedicated physical servers) available in a variety of pricing models. The main selling point behind EC2 is the removal of a need for traffic forecasting by the implementation of auto-scaling. Auto scaling refers to the ability to scale compute resources up or down based traffic.

Horizontal scaling, as opposed to vertical scaling, refers to the ability to increase the number of instances
handling incoming traffic. Vertical scaling, on the other hand, refers to the increase of disk space or memory
for a single instance.

EC2 offers both methods of auto-scaling, but only horizontal scaling can offer un-interrupted service.

## Pricing Models for Hosting EC2 Instances

- **[Spot](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html)**
  - Pros:
    The Spot Pricing Model offers use of an instance using an hourly by AZ and instance type. The rate is adjusted gradually based on the supply / demand for spot instances; which are defined as AWS Instances that are unused.
  - Cons:
    This is not a good choice if you need highly-available application performance. For instance, a Spot Instance may be terminated due to loss of capacity within your chosen AZ and chosen instance type. This makes Spot Instances a good choice for applications and work loads which are flexible regarding their hours of operation and if they can be interrupted.
- **On Demand**
  - Pros:
    - No long term commitment
    - Highly Available
  - Cons:
    - Costly relative to Reserved / Spot Instances
- **Reserved**
  - Pros:
    - Cheap relative to On Demand
  - Cons:
    - Long term (1-3 yr) commitment
- **Dedicated Host**
  - Reserved/On Demand pricing available
  - Uses actual physical server for you only

For all pricing models, charges are based on usage. If an instance is terminated by AWS, no charge is applied, but if it is terminated manually, this is considered part of usage and results in a charge.

## Types of Instances

The instance type chosen during launch determines the hardware used for your instance. Each instance type gives you distinct benefits with hardware optimized for specific purposes including:

- Storage
- Memory
- Computation

Multiple instances exist on a shared host computer. Resources from the host computer are allocated based on instance type. For instance, for an instance with high I/O, more the shared resources will be allocated to that instance.

## [Elastic Block Storage (EBS)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html)

Storage volumes in an EC2 instance are done via “elastic block stores.” These "blocks" are like hard-drives which may be mounted onto any running instance within the same Availability Zone as an instance volume. To move a volume into a different AZ, you must create a snapshot and then restore it as a new volume in that AZ.

These EBS Volumes may be attached to an EC2 instance but they exist independently of the instance. This means they will persist beyond the life-cycle of an instance.

Configuration of a volume mounted to an instance may be changed dynamically.

### Types of EBS Volumes

1. General Purpose SSD (gp2)
2. Provisioned IOPS SSD (io1)
3. Throughput Optimized HDD (st1)
4. Cold HDD (sc1).

What follows are direct qutotations from the documentation, summarizing the distinctions of each:

**Solid State Drive (SSD)**

- Dominant performance metric is IOPS
- Designed for transactional data; meaning, not analyzing big data or returning huge responses, but handling a high volume of reads/writes

> General Purpose SSD volumes offer a base performance of 3 IOPS/GiB, with the ability to burst to 3,000 IOPS for extended periods of time. These volumes are ideal for a broad range of use cases such as boot volumes, small and medium-size databases, and development and test environments.

- IOPS calculated based on volume size.

> Provisioned IOPS SSD volumes support up to 64,000 IOPS and 1,000 MiB/s of throughput. This allows you to predictably scale to tens of thousands of IOPS per EC2 instance.

- IOPS configurable; guaranteed **99.99%** of the time

**Hard Disk Drive (HDD)**

- Dominant performance metric is MBPS (throughput)
- Large, streaming data

> Throughput Optimized HDD volumes provide low-cost magnetic storage that defines performance in terms of throughput rather than IOPS. These volumes are ideal for large, sequential workloads such as Amazon EMR, ETL, data warehouses, and log processing.

> Cold HDD volumes provide low-cost magnetic storage that defines performance in terms of throughput rather than IOPS. These volumes are ideal for large, sequential, cold-data workloads. If you require infrequent access to your data and are looking to save costs, these volumes provides inexpensive block storage.

**Instance Store Volumes**

- Ephemeral storage
- Only configurable at launch

### Elastic File System

You can create an EFS file system and configure your instances to mount the file system. You can use an EFS file system as a common data source for workloads and applications running on multiple instances.

## Placement Groups

How to distribute your instances per use case.

- Clustered
  - High throughput/low-latency
  - Peered VPCs in the same region can talk together
  - Only single AZ
- Partitioned
  - No two clusters share same hardware/network/power-source
  - Maximum of 7 partitions per AZ
- Spread
  - To avoid hardware failure
