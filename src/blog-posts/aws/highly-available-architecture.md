---
title: Part One Setting up a Master Writer Node for our Word Press Blog
tags: public, aws

date: '2019-12-09'
---

- **Configuring the Instance**
  - This instance has WordPress installed on apache http services
  - We configured all the assets in `wp-content/uploads` to be redirected to our cloud front distribution, which stands in front of an s3 Bucket, which has the same assets as `wp-content/uploads`
  - We also have cron jobs scheduled to do two things
    - **first**: sync any updates within the `src` directory of the instance file system w/ the s3 code bucket, to back up our website w/ full redundancy
    - **second**: sync any updates to the `wp-content/uploads` w/ our s3 bucket for media which sits behind the cloud front distribution

This configuration supports a “Master” writer node where our “marketing team” can go in and perform any updates to the site including:

- updating our images
- adding a new blog

## Part Two: Setting up auto-scaling read-only-nodes

- **Create AMI from writer node instance**
  - Defaults config for auto-scaling instances
- **Create Auto Scaling Group**
  - Create launch configuration
    - Tells us how to spin up each new instance
    - Bootstrap script is `aws s3 --delete sync s3://wordpress-code-mnk`
      - This will ensure latest source code is downloaded on newest auto scaled instances
    - Creating auto scale group
      - Prompts for using ELB or not
        - Puts in target group for ELB
  - **Remove Writer From ELB Target Group**
    - In the LAB, they registered the ELB w/ a DNS; so anyone going to this DNS will only be hitting the Target group
    - This allows us to access the writer instance at the IP, or perhaps with just a different DNS that isn’t public

## Summary

- EC2 Instance w/ Word Press installed and the following config
  - Cron Jobs for syncing source code & media w s3
  - All links (stored in wp-content/uploads) overwritten to use cloud front for performance
- Read Nodes which are AMI of the EC2 Writer node set in
  - Auto Scaling Group
    - W/ bootstrap script to get latest code from s3
  - Elastic Load Balancer
    - where write node is not included as a registered targets
- Route 53 config pointing at ELB

## RDS Failover

- Rebooting a RDS instance and selecting failover moves the RDS to a new AZ
