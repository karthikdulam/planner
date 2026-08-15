export const cloud = {
  id: 'cloud',
  name: 'Cloud & DevOps',
  icon: '☁',
  blurb: 'Enough to actually deploy and operate a service you wrote — containerise it, ship it, watch it, debug it in production. Practical depth, not certification trivia.',
  weeks: 'Weeks 20–22 (evenings)',
  topics: [
    {
      id: 'cloud-fundamentals',
      name: 'Cloud fundamentals',
      week: 20, mins: 90,
      summary: 'The vocabulary, the service models, and regions vs availability zones.',
      blocks: [
        { k: 'table', title: 'The service models', head: ['Model', 'You manage', 'Example'], rows: [
          ['**IaaS**', 'OS, runtime, app', 'EC2, GCE'],
          ['**PaaS**', 'Just the app', 'App Engine, Elastic Beanstalk'],
          ['**CaaS**', 'Container images', 'ECS, EKS, Cloud Run'],
          ['**FaaS**', 'Just functions', 'Lambda, Cloud Functions'],
          ['**SaaS**', 'Nothing', 'Gmail, Salesforce'],
        ]},
        { k: 'p', title: 'Regions and availability zones — the bit that matters in interviews', body: [
          'A **region** is a geographic area (ap-south-1 = Mumbai). An **availability zone** is an isolated datacentre within a region. AZs in a region are close enough for low-latency replication but far enough apart that one flood or power failure does not take out both.',
          'The design rule: **deploy across at least two AZs in one region for high availability; deploy across regions only for disaster recovery or user latency.** Multi-region active-active is genuinely hard because of data consistency, so do not propose it casually.',
        ]},
        { k: 'analogy', body: 'A region is a city. Availability zones are separate buildings in that city with independent power and water. Putting all your servers in one building is fine until that building loses power. Putting them in two buildings across town is cheap insurance. Putting them in two different cities is much more expensive and only worth it for specific reasons.' },
        { k: 'note', tone: 'tip', title: 'The shared responsibility model', body: 'A one-liner worth having: *"The provider secures the cloud — hardware, hypervisor, physical access. I secure what is in the cloud — IAM policies, security groups, encryption, patching my containers, and not committing credentials."* It comes up in any security-adjacent conversation.' },
      ],
    },
    {
      id: 'cloud-aws-core',
      name: 'AWS — the services you must recognise',
      week: 22, mins: 130,
      summary: 'What each service is for and when you would reach for it, so you can pick a stack and defend the choice.',
      blocks: [
        { k: 'table', title: 'Compute', head: ['Service', 'What it is', 'When to reach for it'], rows: [
          ['**EC2**', 'Virtual machines', 'Full control, legacy apps, long-running'],
          ['**ECS / Fargate**', 'Managed containers', 'The usual choice for a Spring Boot service'],
          ['**EKS**', 'Managed Kubernetes', 'When you already run K8s or need its ecosystem'],
          ['**Lambda**', 'Functions, event-driven', 'Spiky or infrequent workloads; watch cold starts'],
        ]},
        { k: 'table', title: 'Storage and data', head: ['Service', 'What it is', 'Note'], rows: [
          ['**S3**', 'Object storage', 'Files, images, backups, data lake. 11 nines of durability.'],
          ['**EBS**', 'Block storage for one EC2', 'Like a disk. Single-AZ.'],
          ['**RDS**', 'Managed Postgres/MySQL', 'Automated backups, Multi-AZ failover, read replicas'],
          ['**Aurora**', 'AWS-built MySQL/Postgres', 'Faster, more expensive, storage auto-scales'],
          ['**DynamoDB**', 'Managed NoSQL key-value', 'Single-digit-ms at any scale; design around access patterns'],
          ['**ElastiCache**', 'Managed Redis/Memcached', 'Your caching layer'],
        ]},
        { k: 'table', title: 'Networking, messaging, ops', head: ['Service', 'What it is'], rows: [
          ['**VPC**', 'Your private network. Public subnets face the internet; private ones do not.'],
          ['**ALB / NLB**', 'Layer 7 / Layer 4 load balancers'],
          ['**CloudFront**', 'CDN'],
          ['**Route 53**', 'DNS, with health-check-based failover'],
          ['**SQS**', 'Managed queue — point-to-point, one consumer per message'],
          ['**SNS**', 'Pub/sub fan-out — one message, many subscribers'],
          ['**MSK**', 'Managed Kafka'],
          ['**CloudWatch**', 'Metrics, logs, alarms'],
          ['**IAM**', 'Who can do what. Roles, not access keys.'],
          ['**Secrets Manager**', 'Credentials, rotated. Never environment variables in a repo.'],
        ]},
        { k: 'note', tone: 'tip', title: 'SQS vs SNS vs Kafka — a common question', body: '**SQS**: a queue. One message, one consumer, then it is gone. Use for task distribution. **SNS**: pub/sub. One message pushed to many subscribers, not retained. Use for fan-out notifications. **Kafka**: a retained log. Many consumer groups each read independently at their own pace, and can replay history. Use when you need replay, ordering, or stream processing. The common pattern is SNS → several SQS queues for simple fan-out.' },
        { k: 'note', tone: 'warn', title: 'What actually gets asked', body: 'For a Java backend role, cloud questions are usually "how would you deploy this?" and "how does it scale?" — not "explain VPC peering". A confident answer naming ALB → ECS Fargate across two AZs → RDS Multi-AZ → ElastiCache → S3, with autoscaling on CPU, covers almost every version of this question.' },
      ],
    },
    {
      id: 'cloud-docker',
      name: 'Docker',
      week: 20, mins: 110, tag: 'core',
      summary: 'Containerise your own Spring Boot service. Two days of work, permanently useful.',
      blocks: [
        { k: 'p', body: [
          'A container packages your app with everything it needs to run, so it behaves identically on your laptop and in production. Unlike a VM it shares the host kernel, which is why it starts in a second rather than a minute.',
        ]},
        { k: 'code', lang: 'bash', cap: 'A production-quality Dockerfile for Spring Boot', src: `# Multi-stage: build with the JDK, run on the much smaller JRE.
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy the wrapper and pom FIRST so dependency layers cache across builds.
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw clean package -DskipTests

# --- runtime stage ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Never run as root
RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

# Container-aware heap sizing — without this the JVM can misread the limit
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]` },
        { k: 'code', lang: 'yaml', cap: 'docker-compose for local development', src: `services:
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_PROFILES_ACTIVE: local
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/orders
    depends_on:
      db: { condition: service_healthy }

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: orders
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  pgdata:` },
        { k: 'list', title: 'Commands worth knowing', items: [
          '`docker build -t app:1.0 .` — build an image',
          '`docker run -p 8080:8080 app:1.0` — run it, mapping a port',
          '`docker ps` / `docker logs -f <id>` / `docker exec -it <id> sh`',
          '`docker compose up -d` / `docker compose down -v`',
          '`docker system prune -a` — reclaim disk when it fills up (it will)',
        ]},
        { k: 'note', tone: 'tip', title: 'The three things to mention', body: '**Multi-stage builds** (build with JDK, ship with JRE — the image goes from ~450MB to ~180MB), **layer caching** (copy the pom before the source so dependencies are not re-downloaded on every code change), and **not running as root**. Naming those three shows you have written a Dockerfile for real rather than copied one.' },
      ],
    },
    {
      id: 'cloud-k8s-cicd',
      name: 'Kubernetes & CI/CD',
      week: 21, mins: 130,
      summary: 'Enough to deploy your own service, read a manifest, and debug a pod that will not start.',
      blocks: [
        { k: 'table', title: 'Kubernetes vocabulary', head: ['Object', 'What it is'], rows: [
          ['**Pod**', 'The smallest unit — one or more containers sharing a network namespace'],
          ['**Deployment**', 'Declares "I want N replicas of this pod"; handles rolling updates'],
          ['**Service**', 'A stable network name and load balancing across pods'],
          ['**Ingress**', 'HTTP routing from outside the cluster'],
          ['**ConfigMap / Secret**', 'Configuration and credentials injected as env vars or files'],
          ['**HPA**', 'Horizontal Pod Autoscaler — scales replicas on CPU or custom metrics'],
          ['**Namespace**', 'Logical isolation within a cluster'],
        ]},
        { k: 'code', lang: 'yaml', cap: 'A deployment you could actually explain', src: `apiVersion: apps/v1
kind: Deployment
metadata: { name: order-service }
spec:
  replicas: 3
  selector: { matchLabels: { app: order-service } }
  template:
    metadata: { labels: { app: order-service } }
    spec:
      containers:
        - name: app
          image: myrepo/order-service:1.4.2
          ports: [{ containerPort: 8080 }]
          resources:
            requests: { memory: "512Mi", cpu: "250m" }   # what it is guaranteed
            limits:   { memory: "1Gi",   cpu: "1000m" }  # what it cannot exceed
          readinessProbe:            # "can I receive traffic?"
            httpGet: { path: /actuator/health/readiness, port: 8080 }
            initialDelaySeconds: 20
          livenessProbe:             # "am I alive, or should I be restarted?"
            httpGet: { path: /actuator/health/liveness, port: 8080 }
            initialDelaySeconds: 60` },
        { k: 'note', tone: 'tip', title: 'Readiness vs liveness — the one K8s question you will get', body: '**Readiness** failing removes the pod from the load balancer but leaves it running — used while the app warms up, or when a dependency is temporarily down. **Liveness** failing **restarts the container** — used when the app is wedged beyond recovery. Getting them backwards causes restart loops during startup, which is a classic production incident.' },
        { k: 'code', lang: 'bash', cap: 'Debugging a pod that will not start — the commands you will actually type', src: `# 1. What state is it in? The STATUS column tells you most of the story.
kubectl get pods
#   CrashLoopBackOff  -> the app starts then exits. Read the logs.
#   ImagePullBackOff  -> wrong image name/tag, or missing registry credentials.
#   Pending           -> nothing scheduled it. Usually not enough CPU/memory
#                        in the cluster, or an unsatisfiable nodeSelector.
#   OOMKilled         -> it exceeded its memory limit. Raise it, or fix the leak.

# 2. WHY. The Events section at the bottom is the single most useful output.
kubectl describe pod <pod-name>

# 3. Logs — and for a crash loop, the PREVIOUS container's logs are the ones
#    that contain the actual stack trace.
kubectl logs <pod-name>
kubectl logs <pod-name> --previous     # <-- the crash-loop workhorse
kubectl logs -f deployment/order-service --tail=100

# 4. Get inside a running pod
kubectl exec -it <pod-name> -- sh
kubectl exec -it <pod-name> -- env | sort        # is the config what you think?

# 5. Reach the service from your laptop without exposing it
kubectl port-forward svc/order-service 8080:8080

# 6. Rollouts
kubectl rollout status deployment/order-service
kubectl rollout undo deployment/order-service     # revert a bad deploy
kubectl rollout history deployment/order-service

# 7. Why is the service returning nothing? Nearly always the selector.
kubectl get endpoints order-service
#   No endpoints = the Service's selector matches no READY pods.
#   Either the labels do not match, or readiness is failing.` },
        { k: 'note', tone: 'trap', title: 'The Java-specific one that catches people', body: 'A JVM in a container with a memory **limit** but no `-XX:MaxRAMPercentage` may size its heap from the *host* memory rather than the cgroup limit, then get `OOMKilled` by the kernel with no Java stack trace at all — just a pod that vanishes. Set `-XX:MaxRAMPercentage=75.0` and always leave headroom above the heap for metaspace, thread stacks and native buffers. Memory `limit` should be roughly 1.3× your intended heap.' },
        { k: 'code', lang: 'yaml', cap: 'A GitHub Actions pipeline', src: `name: CI
on:
  push: { branches: [main] }
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: 'temurin', cache: 'maven' }

      - name: Test
        run: ./mvnw -B verify

      - name: Build image
        run: docker build -t \${{ github.repository }}:\${{ github.sha }} .

      - name: Push
        if: github.ref == 'refs/heads/main'
        run: docker push \${{ github.repository }}:\${{ github.sha }}` },
        { k: 'table', title: 'Deployment strategies', head: ['Strategy', 'How', 'Trade-off'], rows: [
          ['Rolling', 'Replace pods gradually', 'The default. Two versions live at once.'],
          ['Blue-green', 'Two full environments, switch traffic', 'Instant rollback; double the infrastructure'],
          ['Canary', 'Route 5% of traffic to the new version', 'Safest; needs good metrics to judge'],
        ]},
      ],
    },
    {
      id: 'cloud-observability',
      name: 'Observability & debugging production',
      week: 22, mins: 110,
      summary: 'The three pillars, and the systematic answer to "latency went up".',
      blocks: [
        { k: 'table', title: 'The three pillars', head: ['Pillar', 'Answers', 'Tools'], rows: [
          ['**Metrics**', '"Is something wrong?" — numbers over time', 'Prometheus, CloudWatch, Micrometer'],
          ['**Logs**', '"What exactly happened?" — discrete events', 'ELK, Loki, CloudWatch Logs'],
          ['**Traces**', '"Where did the time go?" — one request across services', 'Jaeger, Zipkin, OpenTelemetry'],
        ]},
        { k: 'list', title: 'The four golden signals — worth naming', items: [
          '**Latency** — how long requests take. Always look at p95 and p99, never the average; the average hides the users who are suffering.',
          '**Traffic** — requests per second.',
          '**Errors** — the rate of failed requests.',
          '**Saturation** — how full the system is (CPU, memory, connection pool, queue depth).',
        ]},
        { k: 'note', tone: 'tip', title: 'The question you will be asked, and the answer', body: '*"Production latency went from 200ms to 2 seconds. What do you do?"* The wrong answer names a cause. The right answer is a **process**: **(1)** Check whether it is all endpoints or one — that halves the search space immediately. **(2)** Check when it started and what changed then — a deploy, a traffic increase, a dependency. **(3)** Look at the traces: where in the request is the time going? **(4)** Check saturation — connection pool exhausted, GC pauses, CPU throttling. **(5)** Check the dependencies — is the database slow, or is a downstream service slow? **(6)** Form one hypothesis, change one thing, measure. Interviewers are testing whether you debug systematically or by guessing.' },
        { k: 'code', lang: 'java', cap: 'Structured logging with correlation', src: `// A trace/correlation ID in the MDC means every log line for one request
// can be pulled together across every service it touched.
@Component
public class CorrelationFilter extends OncePerRequestFilter {
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws Exception {
        String correlationId = Optional.ofNullable(req.getHeader("X-Correlation-Id"))
                                       .orElse(UUID.randomUUID().toString());
        MDC.put("correlationId", correlationId);
        res.setHeader("X-Correlation-Id", correlationId);
        try { chain.doFilter(req, res); }
        finally { MDC.clear(); }      // ALWAYS clear — the thread is pooled
    }
}

// Log structured key-values, not sentences. Sentences cannot be queried.
log.info("Order placed orderId={} customerId={} total={} durationMs={}",
         order.getId(), order.getCustomerId(), order.getTotal(), elapsed);` },
      ],
    },
    {
      id: 'cloud-git-linux',
      name: 'Git & Linux essentials',
      week: 22, mins: 80,
      summary: 'The commands you should not have to look up in an interview.',
      blocks: [
        { k: 'code', lang: 'bash', cap: 'Git — beyond add/commit/push', src: `# What actually changed, staged vs unstaged
git diff                    # unstaged
git diff --staged           # staged

# Rewrite your last commit (before pushing)
git commit --amend

# Move your branch on top of the latest main — linear history
git rebase main
git rebase -i HEAD~3        # squash/reword the last 3 (local only)

# Undo, three flavours — know the difference
git reset --soft HEAD~1     # undo the commit, KEEP changes staged
git reset --mixed HEAD~1    # undo the commit, keep changes unstaged (default)
git reset --hard HEAD~1     # undo the commit, DISCARD changes  <-- destructive

# Undo a pushed commit safely: a new commit that reverses it
git revert <sha>

# Park work in progress
git stash / git stash pop

# Find which commit introduced a bug, by binary search
git bisect start; git bisect bad; git bisect good <sha>

# Bring one commit from another branch
git cherry-pick <sha>` },
        { k: 'note', tone: 'warn', title: 'Rebase vs merge — the interview version', body: '**Merge** preserves the true history and creates a merge commit; safe on shared branches. **Rebase** rewrites your commits on top of the target for a linear history; **never rebase a branch other people have pulled**, because you rewrite commits they already have. The common team convention is: rebase your own feature branch to stay current, merge it into main.' },
        { k: 'code', lang: 'bash', cap: 'Linux — debugging a running service', src: `# What is happening right now
top / htop                     # CPU and memory by process
df -h                          # disk space (a very common outage cause)
free -h                        # memory

# Find the process on a port
lsof -i :8080
netstat -tulpn | grep 8080

# Logs
tail -f app.log                          # follow
grep -i "error" app.log | tail -50       # recent errors
grep -c "OutOfMemory" app.log            # count occurrences
journalctl -u myservice -f --since "10 min ago"

# JVM-specific — these are the ones that impress
jps -l                         # list running JVMs
jstack <pid> > thread.txt      # thread dump: find deadlocks and hung threads
jmap -dump:live,format=b,file=heap.hprof <pid>   # heap dump
jstat -gc <pid> 1000           # GC activity every second

# Find big files when the disk fills
du -sh /var/log/* | sort -rh | head` },
        { k: 'note', tone: 'tip', title: 'The jstack answer', body: 'When asked "the application is hung, what do you do?", the strong answer is: *"Take a thread dump with `jstack` — twice, ten seconds apart. Compare them: threads stuck in the same place across both dumps are the problem. Look for BLOCKED threads and for a deadlock, which jstack detects and reports explicitly at the bottom of the dump."* Very few candidates know this and it is genuinely how it is done.' },
      ],
    },
  ],
}
