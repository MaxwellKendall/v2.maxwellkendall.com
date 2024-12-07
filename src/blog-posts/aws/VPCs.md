---
title: Virtual Private Cloud (VPC)
tags: public, aws

date: '2019-12-09'
---

Networking concepts

## Peering VPCs

    - Linking two VPCs together via a connection object
    	- Like a VPN or DX
    - Span AWS accounts and Regions
    - Share private ips
    - One VPC connected toanother

Constraints: - CIDR must not overlap - No transitive routing - IE VPC1,2,3 requires 3 separate peers

## VPC Endpoints

    - Adding access to AWS Resources within VPC w/o NAT Gateway or Internet Gateway

## Egress Only to Internet

    - IGW w/ egress only is for IPv6
    - NAT Gateway for IPv4

## Network Routing & Firewalls

Network routing is defined by a Route Table. These rules are protected by firewalls.

### Firewalls

**NACL** - At the Subnet Level - Stateless - Allows for white listing / blacklisting IPs

**Security Groups** - At the instance level - Stateful - Requests allowed out grants access to responses back; despite outbound rules - Responses allowed in are allowed out; despite outbound rules.

#aws/associate/test-prep
