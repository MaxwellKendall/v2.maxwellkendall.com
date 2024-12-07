---
title: Relational Database Service (RDS)
tags: public, aws

date: '2019-12-09'
---

**Multi AZ Deployments**
In deploying a DB, you can specify if you want Multi AZ. In this option, the standby db is **synchronously replicated** in the secondary AZ.

### Failover

Automatic failover comes with Multi-AZ deployment so that only ~60-120 seconds of downtime occurs and the DNS record is updated to point at the standby DB.

Triggered by any of the following:

- AZ failure
- Primary DB failure
- Reboot w/ failover

## Read Replicas

MariaDB, MySQL, Oracle, PostgresDB **asynchronously replicate** read only version of the DB.

Use Cases:

- Read Heavy Work loads
- DR
- Maintenance Downtime

#aws/associate/test-prep
