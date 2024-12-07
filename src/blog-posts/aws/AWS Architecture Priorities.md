---
title: Performant Architecutres
tags: public, aws

date: '2019-12-09'
---

Amazon Web Services were designed with certain principles and values in mind. These are specified throughout their documentation and in various white papers. Services should be decoupled and composable together. We shouldn't have massive application on one computing resource incapable of horizontal scaling.

Here are some of the potential features of an application whose architecture relies on their services:

- Performant
- Cost Efficent
- Durable
- Secure

What follows is an explanation of how various services may be architected together to acheive these features which we've come to expect from amazon.com.

## Storage

There are a variety or services dedicated to store data in AWS. They include the following.

### S3

Uploading to S3 can be done through (a) AWS Console, (b) CLI, (c) Storage Gateway (Files, Volumes, Tapes). Uploading through a Storage Gateway is generally required for migration of enterprise systems to AWS.

### Elastic File System

Provides a way to store shared files required by multiple EC2 Instances. Basically a way of avoiding creating the same file system on every single EC2 Instance in your AWS Environment.

### EBS

#### Durability

EBS is designed to provide block level (think disk level / hard drive level) storage solutions which persist independently and beyond the life of associated compute instances. However, the default behavior for any blocks assocaited with an EC2 Instance, as the root volume, is to be deleted.

### Cost Efficency

HDD based volumes are always cheaper than SSD.

### Relational Database Service (RDS)

**Database Reads**
Using an in-memory open source solution to handle the caching of frequently executed queries is one way to immediately increase the performance of your database on reads. The services available to use in AWS for this purpose are Redis and ElastiCache.

Another way to increase the performance of the database on read requests is to create read-replicas of your primary database. This is a strong feature of Amazon Aurora (in PostgreSQL or MySQL), which allows for asynchronous replication of updates to the database within a 100ms interval.

## Elastic Cloud Compute (EC2)

Based on the requirements of your application, you may want to choose from one of the following placement groups. A placement group is simply a strategy for how to configure the deployment of your EC2 Instances.

- Cluster: All instances are in a a single AZ, to acheive low-latency and high throughput
- Spread: All instances are isolated to avoid inter-dependency
- Partitioned: Same as spread; although multiple instances are in isolated together
