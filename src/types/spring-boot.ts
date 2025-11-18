/**
 * Spring Boot test generation type definitions
 */

/**
 * Spring Boot module type
 */
export type SpringBootModuleType = 'rest' | 'service' | 'dao' | 'model' | 'common';

/**
 * Test type to generate
 */
export type SpringBootTestType = 'controller' | 'service' | 'dao' | 'integration';

/**
 * Spring Boot test generation options
 */
export interface SpringBootTestOptions {
  /** API/Project name */
  apiName: string;
  /** Java base package (e.g., com.bbva.apiname) */
  basePackage: string;
  /** Module type */
  moduleType: SpringBootModuleType;
  /** Test type */
  testType: SpringBootTestType;
  /** Class name to test */
  className: string;
  /** Endpoints (for controller tests) */
  endpoints?: EndpointDefinition[];
  /** Methods (for service/DAO tests) */
  methods?: MethodDefinition[];
  /** Output directory */
  outputDir?: string;
  /** Use Lombok */
  useLombok?: boolean;
  /** Spring Boot version */
  springBootVersion?: string;
}

/**
 * Endpoint definition for controller tests
 */
export interface EndpointDefinition {
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Endpoint path */
  path: string;
  /** Request body class (if POST/PUT/PATCH) */
  requestBody?: string;
  /** Response class */
  responseClass?: string;
  /** Path variables */
  pathVariables?: string[];
  /** Query parameters */
  queryParams?: string[];
  /** Expected status code */
  expectedStatus?: number;
}

/**
 * Method definition for service/DAO tests
 */
export interface MethodDefinition {
  /** Method name */
  name: string;
  /** Return type */
  returnType: string;
  /** Parameters */
  parameters?: ParameterDefinition[];
  /** Dependencies to mock */
  dependencies?: string[];
  /** Throws exception */
  throwsException?: string;
}

/**
 * Parameter definition
 */
export interface ParameterDefinition {
  name: string;
  type: string;
  annotations?: string[];
}

/**
 * Maven module structure
 */
export interface MavenModuleStructure {
  /** Module name (e.g., rest-sb-apiname) */
  moduleName: string;
  /** Source directory */
  srcDir: string;
  /** Test directory */
  testDir: string;
  /** Package path */
  packagePath: string;
}

/**
 * Spring Boot project configuration
 */
export interface SpringBootProjectConfig {
  /** Project root directory */
  rootDir: string;
  /** API name */
  apiName: string;
  /** Base package */
  basePackage: string;
  /** Modules */
  modules: MavenModuleStructure[];
  /** Spring Boot version */
  springBootVersion?: string;
  /** Java version */
  javaVersion?: string;
}

/**
 * Test class metadata
 */
export interface TestClassMetadata {
  /** Test class name */
  className: string;
  /** Package name */
  packageName: string;
  /** Class under test */
  targetClass: string;
  /** Imports */
  imports: string[];
  /** Test methods */
  testMethods: TestMethodMetadata[];
}

/**
 * Test method metadata
 */
export interface TestMethodMetadata {
  /** Method name */
  name: string;
  /** Test description */
  description: string;
  /** Method body */
  body: string;
  /** Annotations */
  annotations?: string[];
}
