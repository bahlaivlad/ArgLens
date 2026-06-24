const FLAG_DEFS = {
  allocationType: {
    0x00001000: "MEM_COMMIT",
    0x00002000: "MEM_RESERVE",
    0x00004000: "MEM_DECOMMIT",
    0x00008000: "MEM_RELEASE",
    0x00020000: "MEM_RESET",
    0x00100000: "MEM_TOP_DOWN",
    0x00200000: "MEM_WRITE_WATCH",
    0x00400000: "MEM_PHYSICAL",
    0x00800000: "MEM_ROTATE",
    0x01000000: "MEM_LARGE_PAGES"
  },
  pageProtect: {
    0x01: "PAGE_NOACCESS",
    0x02: "PAGE_READONLY",
    0x04: "PAGE_READWRITE",
    0x08: "PAGE_WRITECOPY",
    0x10: "PAGE_EXECUTE",
    0x20: "PAGE_EXECUTE_READ",
    0x40: "PAGE_EXECUTE_READWRITE",
    0x80: "PAGE_EXECUTE_WRITECOPY",
    0x100: "PAGE_GUARD",
    0x200: "PAGE_NOCACHE",
    0x400: "PAGE_WRITECOMBINE"
  },
  fileAccess: {
    0x80000000: "GENERIC_READ",
    0x40000000: "GENERIC_WRITE",
    0x20000000: "GENERIC_EXECUTE",
    0x10000000: "GENERIC_ALL",
    0x00100000: "SYNCHRONIZE",
    0x00010000: "DELETE",
    0x00020000: "READ_CONTROL",
    0x00040000: "WRITE_DAC",
    0x00080000: "WRITE_OWNER"
  },
  fileShare: {
    0x1: "FILE_SHARE_READ",
    0x2: "FILE_SHARE_WRITE",
    0x4: "FILE_SHARE_DELETE"
  },
  creationDisposition: {
    1: "CREATE_NEW",
    2: "CREATE_ALWAYS",
    3: "OPEN_EXISTING",
    4: "OPEN_ALWAYS",
    5: "TRUNCATE_EXISTING"
  },
  fileAttributes: {
    0x00000001: "FILE_ATTRIBUTE_READONLY",
    0x00000002: "FILE_ATTRIBUTE_HIDDEN",
    0x00000004: "FILE_ATTRIBUTE_SYSTEM",
    0x00000010: "FILE_ATTRIBUTE_DIRECTORY",
    0x00000020: "FILE_ATTRIBUTE_ARCHIVE",
    0x00000080: "FILE_ATTRIBUTE_NORMAL",
    0x00000100: "FILE_ATTRIBUTE_TEMPORARY",
    0x04000000: "FILE_FLAG_DELETE_ON_CLOSE",
    0x08000000: "FILE_FLAG_SEQUENTIAL_SCAN",
    0x10000000: "FILE_FLAG_RANDOM_ACCESS",
    0x40000000: "FILE_FLAG_OVERLAPPED",
    0x80000000: "FILE_FLAG_WRITE_THROUGH"
  },
  processAccess: {
    0x0001: "PROCESS_TERMINATE",
    0x0002: "PROCESS_CREATE_THREAD",
    0x0008: "PROCESS_VM_OPERATION",
    0x0010: "PROCESS_VM_READ",
    0x0020: "PROCESS_VM_WRITE",
    0x0040: "PROCESS_DUP_HANDLE",
    0x0400: "PROCESS_QUERY_INFORMATION",
    0x1000: "PROCESS_QUERY_LIMITED_INFORMATION",
    0x001f0fff: "PROCESS_ALL_ACCESS"
  },
  threadAccess: {
    0x0001: "THREAD_TERMINATE",
    0x0002: "THREAD_SUSPEND_RESUME",
    0x0008: "THREAD_GET_CONTEXT",
    0x0010: "THREAD_SET_CONTEXT",
    0x0020: "THREAD_SET_INFORMATION",
    0x0040: "THREAD_QUERY_INFORMATION",
    0x0100: "THREAD_SET_THREAD_TOKEN",
    0x0200: "THREAD_IMPERSONATE",
    0x0400: "THREAD_DIRECT_IMPERSONATION",
    0x001f03ff: "THREAD_ALL_ACCESS"
  },
  wait: {
    0x00000000: "WAIT_OBJECT_0",
    0x00000080: "WAIT_ABANDONED",
    0x00000102: "WAIT_TIMEOUT",
    0xffffffff: "INFINITE"
  },
  loadLibraryFlags: {
    0x00000001: "DONT_RESOLVE_DLL_REFERENCES",
    0x00000002: "LOAD_LIBRARY_AS_DATAFILE",
    0x00000008: "LOAD_WITH_ALTERED_SEARCH_PATH",
    0x00000800: "LOAD_LIBRARY_SEARCH_SYSTEM32",
    0x00001000: "LOAD_LIBRARY_SEARCH_DEFAULT_DIRS"
  },
  moveMethod: {
    0: "FILE_BEGIN",
    1: "FILE_CURRENT",
    2: "FILE_END"
  },
  showWindow: {
    0: "SW_HIDE",
    1: "SW_SHOWNORMAL",
    3: "SW_SHOWMAXIMIZED",
    5: "SW_SHOW",
    6: "SW_MINIMIZE",
    9: "SW_RESTORE",
    10: "SW_SHOWDEFAULT"
  },
  socketAf: {
    2: "AF_INET",
    10: "AF_INET6",
    23: "AF_INET6",
    0x17: "AF_INET6"
  },
  socketType: {
    1: "SOCK_STREAM",
    2: "SOCK_DGRAM",
    3: "SOCK_RAW"
  },
  socketProtocol: {
    0: "IPPROTO_IP",
    6: "IPPROTO_TCP",
    17: "IPPROTO_UDP"
  },
  ntCreateDisposition: {
    0: "FILE_SUPERSEDE",
    1: "FILE_OPEN",
    2: "FILE_CREATE",
    3: "FILE_OPEN_IF",
    4: "FILE_OVERWRITE",
    5: "FILE_OVERWRITE_IF"
  },
  ntCreateOptions: {
    0x00000001: "FILE_DIRECTORY_FILE",
    0x00000002: "FILE_WRITE_THROUGH",
    0x00000004: "FILE_SEQUENTIAL_ONLY",
    0x00000020: "FILE_SYNCHRONOUS_IO_NONALERT",
    0x00000040: "FILE_SYNCHRONOUS_IO_ALERT",
    0x00001000: "FILE_DELETE_ON_CLOSE",
    0x00002000: "FILE_OPEN_BY_FILE_ID",
    0x00004000: "FILE_OPEN_FOR_BACKUP_INTENT"
  },
  sectionAccess: {
    0x0001: "SECTION_QUERY",
    0x0002: "SECTION_MAP_WRITE",
    0x0004: "SECTION_MAP_READ",
    0x0008: "SECTION_MAP_EXECUTE",
    0x0010: "SECTION_EXTEND_SIZE",
    0x000f001f: "SECTION_ALL_ACCESS"
  },
  registryAccess: {
    0x0001: "KEY_QUERY_VALUE",
    0x0002: "KEY_SET_VALUE",
    0x0004: "KEY_CREATE_SUB_KEY",
    0x0008: "KEY_ENUMERATE_SUB_KEYS",
    0x0010: "KEY_NOTIFY",
    0x0020: "KEY_CREATE_LINK",
    0x00020019: "KEY_READ",
    0x00020006: "KEY_WRITE",
    0x000f003f: "KEY_ALL_ACCESS"
  },
  registryType: {
    1: "REG_SZ",
    2: "REG_EXPAND_SZ",
    3: "REG_BINARY",
    4: "REG_DWORD",
    7: "REG_MULTI_SZ",
    11: "REG_QWORD"
  },
  tokenAccess: {
    0x0008: "TOKEN_QUERY",
    0x0020: "TOKEN_ADJUST_PRIVILEGES",
    0x000f01ff: "TOKEN_ALL_ACCESS"
  },
  serviceAccess: {
    0x0001: "SERVICE_QUERY_CONFIG",
    0x0002: "SERVICE_CHANGE_CONFIG",
    0x0010: "SERVICE_START",
    0x0020: "SERVICE_STOP",
    0x000f01ff: "SERVICE_ALL_ACCESS"
  },
  scmAccess: {
    0x0001: "SC_MANAGER_CONNECT",
    0x0002: "SC_MANAGER_CREATE_SERVICE",
    0x0004: "SC_MANAGER_ENUMERATE_SERVICE",
    0x000f003f: "SC_MANAGER_ALL_ACCESS"
  },
  eventCreateFlags: {
    0x00000001: "CREATE_EVENT_MANUAL_RESET",
    0x00000002: "CREATE_EVENT_INITIAL_SET"
  },
  eventAccess: {
    0x0002: "EVENT_MODIFY_STATE",
    0x001f0003: "EVENT_ALL_ACCESS"
  },
  mutexAccess: {
    0x0001: "MUTEX_MODIFY_STATE",
    0x001f0001: "MUTEX_ALL_ACCESS"
  },
  semaphoreAccess: {
    0x0002: "SEMAPHORE_MODIFY_STATE",
    0x001f0003: "SEMAPHORE_ALL_ACCESS"
  }
,
  timerAccess: {
    0x0001: "TIMER_QUERY_STATE",
    0x0002: "TIMER_MODIFY_STATE",
    0x001f0003: "TIMER_ALL_ACCESS"
  },
  directoryAccess: {
    0x0001: "DIRECTORY_QUERY",
    0x0002: "DIRECTORY_TRAVERSE",
    0x0004: "DIRECTORY_CREATE_OBJECT",
    0x0008: "DIRECTORY_CREATE_SUBDIRECTORY",
    0x000f000f: "DIRECTORY_ALL_ACCESS"
  },
  symbolicLinkAccess: {
    0x0001: "SYMBOLIC_LINK_QUERY",
    0x000f0001: "SYMBOLIC_LINK_ALL_ACCESS"
  },
,
  createFile2_dwShareMode: {
    0x1: "FILE_SHARE_READ",
    0x2: "FILE_SHARE_WRITE",
    0x4: "FILE_SHARE_DELETE"
  },
  createFile2_dwCreationDisposition: {
    0x1: "CREATE_NEW",
    0x2: "CREATE_ALWAYS",
    0x3: "OPEN_EXISTING",
    0x4: "OPEN_ALWAYS",
    0x5: "TRUNCATE_EXISTING"
  },
  createFileMappingFromApp_PageProtection: {
    0x2: "PAGE_READONLY",
    0x4: "PAGE_READWRITE",
    0x8: "PAGE_WRITECOPY",
    0x4000000: "SEC_RESERVE",
    0x8000000: "SEC_COMMIT",
    0x10000000: "SEC_NOCACHE",
    0x11000000: "SEC_IMAGE_NO_EXECUTE",
    0x40000000: "SEC_WRITECOMBINE",
    0x80000000: "SEC_LARGE_PAGES"
  },
  createFileMappingNuma_flProtect: {
    0x2: "PAGE_READONLY",
    0x4: "PAGE_READWRITE",
    0x8: "PAGE_WRITECOPY",
    0x20: "PAGE_EXECUTE_READ",
    0x40: "PAGE_EXECUTE_READWRITE",
    0x80: "PAGE_EXECUTE_WRITECOPY",
    0x1000000: "SEC_IMAGE",
    0x4000000: "SEC_RESERVE",
    0x8000000: "SEC_COMMIT",
    0x10000000: "SEC_NOCACHE",
    0x11000000: "SEC_IMAGE_NO_EXECUTE",
    0x40000000: "SEC_WRITECOMBINE",
    0x80000000: "SEC_LARGE_PAGES"
  },
  createFileMappingNuma_nndPreferred: {
    0xffffffff: "NUMA_NO_PREFERRED_NODE"
  },
  createRemoteThread_dwCreationFlags: {
    0x4: "CREATE_SUSPENDED",
    0x10000: "STACK_SIZE_PARAM_IS_A_RESERVATION"
  },
  createRemoteThreadEx_dwCreationFlags: {
    0x4: "CREATE_SUSPENDED",
    0x10000: "STACK_SIZE_PARAM_IS_A_RESERVATION"
  },
  createThread_dwCreationFlags: {
    0x4: "CREATE_SUSPENDED",
    0x10000: "STACK_SIZE_PARAM_IS_A_RESERVATION"
  },
  createWaitableTimerEx_dwFlags: {
    0x1: "CREATE_WAITABLE_TIMER_MANUAL_RESET",
    0x2: "CREATE_WAITABLE_TIMER_HIGH_RESOLUTION"
  },
  duplicateHandle_dwOptions: {
    0x1: "DUPLICATE_CLOSE_SOURCE",
    0x2: "DUPLICATE_SAME_ACCESS"
  },
  isProcessorFeaturePresent_ProcessorFeature: {
    0x0: "PF_FLOATING_POINT_PRECISION_ERRATA",
    0x1: "PF_FLOATING_POINT_EMULATED",
    0x2: "PF_COMPARE_EXCHANGE_DOUBLE",
    0x3: "PF_MMX_INSTRUCTIONS_AVAILABLE",
    0x6: "PF_XMMI_INSTRUCTIONS_AVAILABLE",
    0x7: "PF_3DNOW_INSTRUCTIONS_AVAILABLE",
    0x8: "PF_RDTSC_INSTRUCTION_AVAILABLE",
    0x9: "PF_PAE_ENABLED",
    0xa: "PF_XMMI64_INSTRUCTIONS_AVAILABLE",
    0xc: "PF_NX_ENABLED",
    0xd: "PF_SSE3_INSTRUCTIONS_AVAILABLE",
    0xe: "PF_COMPARE_EXCHANGE128",
    0xf: "PF_COMPARE64_EXCHANGE128",
    0x10: "PF_CHANNELS_ENABLED",
    0x11: "PF_XSAVE_ENABLED",
    0x12: "PF_ARM_VFP_32_REGISTERS_AVAILABLE",
    0x14: "PF_SECOND_LEVEL_ADDRESS_TRANSLATION",
    0x15: "PF_VIRT_FIRMWARE_ENABLED",
    0x16: "PF_RDWRFSGSBASE_AVAILABLE",
    0x17: "PF_FASTFAIL_AVAILABLE",
    0x18: "PF_ARM_DIVIDE_INSTRUCTION_AVAILABLE",
    0x19: "PF_ARM_64BIT_LOADSTORE_ATOMIC",
    0x1a: "PF_ARM_EXTERNAL_CACHE_AVAILABLE",
    0x1b: "PF_ARM_FMAC_INSTRUCTIONS_AVAILABLE",
    0x1d: "PF_ARM_V8_INSTRUCTIONS_AVAILABLE",
    0x1e: "PF_ARM_V8_CRYPTO_INSTRUCTIONS_AVAILABLE",
    0x1f: "PF_ARM_V8_CRC32_INSTRUCTIONS_AVAILABLE",
    0x22: "PF_ARM_V81_ATOMIC_INSTRUCTIONS_AVAILABLE",
    0x24: "PF_SSSE3_INSTRUCTIONS_AVAILABLE",
    0x25: "PF_SSE4_1_INSTRUCTIONS_AVAILABLE",
    0x26: "PF_SSE4_2_INSTRUCTIONS_AVAILABLE",
    0x27: "PF_AVX_INSTRUCTIONS_AVAILABLE",
    0x28: "PF_AVX2_INSTRUCTIONS_AVAILABLE",
    0x29: "PF_AVX512F_INSTRUCTIONS_AVAILABLE",
    0x2b: "PF_ARM_V82_DP_INSTRUCTIONS_AVAILABLE",
    0x2c: "PF_ARM_V83_JSCVT_INSTRUCTIONS_AVAILABLE",
    0x2d: "PF_ARM_V83_LRCPC_INSTRUCTIONS_AVAILABLE",
    0x2e: "PF_ARM_SVE_INSTRUCTIONS_AVAILABLE",
    0x2f: "PF_ARM_SVE2_INSTRUCTIONS_AVAILABLE",
    0x30: "PF_ARM_SVE2_1_INSTRUCTIONS_AVAILABLE",
    0x31: "PF_ARM_SVE_AES_INSTRUCTIONS_AVAILABLE",
    0x32: "PF_ARM_SVE_PMULL128_INSTRUCTIONS_AVAILABLE",
    0x33: "PF_ARM_SVE_BITPERM_INSTRUCTIONS_AVAILABLE",
    0x34: "PF_ARM_SVE_BF16_INSTRUCTIONS_AVAILABLE",
    0x35: "PF_ARM_SVE_EBF16_INSTRUCTIONS_AVAILABLE",
    0x36: "PF_ARM_SVE_B16B16_INSTRUCTIONS_AVAILABLE",
    0x37: "PF_ARM_SVE_SHA3_INSTRUCTIONS_AVAILABLE",
    0x38: "PF_ARM_SVE_SM4_INSTRUCTIONS_AVAILABLE",
    0x39: "PF_ARM_SVE_I8MM_INSTRUCTIONS_AVAILABLE",
    0x3a: "PF_ARM_SVE_F32MM_INSTRUCTIONS_AVAILABLE",
    0x3b: "PF_ARM_SVE_F64MM_INSTRUCTIONS_AVAILABLE",
    0x3c: "PF_BMI2_INSTRUCTIONS_AVAILABLE",
    0x3d: "PF_MOVDIR64B_INSTRUCTION_AVAILABLE",
    0x3e: "PF_ARM_LSE2_AVAILABLE",
    0x40: "PF_ARM_SHA3_INSTRUCTIONS_AVAILABLE",
    0x41: "PF_ARM_SHA512_INSTRUCTIONS_AVAILABLE",
    0x42: "PF_ARM_V82_I8MM_INSTRUCTIONS_AVAILABLE",
    0x43: "PF_ARM_V82_FP16_INSTRUCTIONS_AVAILABLE",
    0x44: "PF_ARM_V86_BF16_INSTRUCTIONS_AVAILABLE",
    0x45: "PF_ARM_V86_EBF16_INSTRUCTIONS_AVAILABLE",
    0x46: "PF_ARM_SME_INSTRUCTIONS_AVAILABLE",
    0x47: "PF_ARM_SME2_INSTRUCTIONS_AVAILABLE",
    0x48: "PF_ARM_SME2_1_INSTRUCTIONS_AVAILABLE",
    0x49: "PF_ARM_SME2_2_INSTRUCTIONS_AVAILABLE",
    0x4a: "PF_ARM_SME_AES_INSTRUCTIONS_AVAILABLE",
    0x4b: "PF_ARM_SME_SBITPERM_INSTRUCTIONS_AVAILABLE",
    0x4c: "PF_ARM_SME_SF8MM4_INSTRUCTIONS_AVAILABLE",
    0x4d: "PF_ARM_SME_SF8MM8_INSTRUCTIONS_AVAILABLE",
    0x4e: "PF_ARM_SME_SF8DP2_INSTRUCTIONS_AVAILABLE",
    0x4f: "PF_ARM_SME_SF8DP4_INSTRUCTIONS_AVAILABLE",
    0x50: "PF_ARM_SME_SF8FMA_INSTRUCTIONS_AVAILABLE",
    0x51: "PF_ARM_SME_F8F32_INSTRUCTIONS_AVAILABLE",
    0x52: "PF_ARM_SME_F8F16_INSTRUCTIONS_AVAILABLE",
    0x53: "PF_ARM_SME_F16F16_INSTRUCTIONS_AVAILABLE",
    0x54: "PF_ARM_SME_B16B16_INSTRUCTIONS_AVAILABLE",
    0x55: "PF_ARM_SME_F64F64_INSTRUCTIONS_AVAILABLE",
    0x56: "PF_ARM_SME_I16I64_INSTRUCTIONS_AVAILABLE",
    0x58: "PF_ARM_SME_FA64_INSTRUCTIONS_AVAILABLE",
    0x59: "PF_UMONITOR_INSTRUCTION_AVAILABLE"
  },
  lockFileEx_dwFlags: {
    0x1: "LOCKFILE_FAIL_IMMEDIATELY",
    0x2: "LOCKFILE_EXCLUSIVE_LOCK"
  },
  mapViewOfFile3_AllocationType: {
    0x2000: "MEM_RESERVE",
    0x4000: "MEM_REPLACE_PLACEHOLDER",
    0x20000000: "MEM_LARGE_PAGES"
  },
  mapViewOfFile3FromApp_AllocationType: {
    0x2000: "MEM_RESERVE",
    0x4000: "MEM_REPLACE_PLACEHOLDER",
    0x20000000: "MEM_LARGE_PAGES"
  },
  setDefaultDllDirectories_DirectoryFlags: {
    0x200: "LOAD_LIBRARY_SEARCH_APPLICATION_DIR",
    0x400: "LOAD_LIBRARY_SEARCH_USER_DIRS",
    0x800: "LOAD_LIBRARY_SEARCH_SYSTEM32",
    0x1000: "LOAD_LIBRARY_SEARCH_DEFAULT_DIRS"
  },
  setHandleInformation_dwFlags: {
    0x1: "HANDLE_FLAG_INHERIT",
    0x2: "HANDLE_FLAG_PROTECT_FROM_CLOSE"
  },
  setPriorityClass_dwPriorityClass: {
    0x20: "NORMAL_PRIORITY_CLASS",
    0x40: "IDLE_PRIORITY_CLASS",
    0x80: "HIGH_PRIORITY_CLASS",
    0x100: "REALTIME_PRIORITY_CLASS",
    0x4000: "BELOW_NORMAL_PRIORITY_CLASS",
    0x8000: "ABOVE_NORMAL_PRIORITY_CLASS",
    0x100000: "PROCESS_MODE_BACKGROUND_BEGIN",
    0x200000: "PROCESS_MODE_BACKGROUND_END"
  },
  setProcessShutdownParameters_dwFlags: {
    0x1: "SHUTDOWN_NORETRY"
  },
  setProcessWorkingSetSizeEx_Flags: {
    0x1: "QUOTA_LIMITS_HARDWS_MIN_ENABLE",
    0x2: "QUOTA_LIMITS_HARDWS_MIN_DISABLE",
    0x4: "QUOTA_LIMITS_HARDWS_MAX_ENABLE",
    0x8: "QUOTA_LIMITS_HARDWS_MAX_DISABLE"
  },
  setSystemFileCacheSize_Flags: {
    0x1: "FILE_CACHE_MAX_HARD_ENABLE",
    0x2: "FILE_CACHE_MAX_HARD_DISABLE",
    0x4: "FILE_CACHE_MIN_HARD_ENABLE",
    0x8: "FILE_CACHE_MIN_HARD_DISABLE"
  },
  setThreadPriority_nPriority: {
    0x0: "THREAD_PRIORITY_LOWEST",
    0x1: "THREAD_PRIORITY_ABOVE_NORMAL",
    0x2: "THREAD_PRIORITY_BELOW_NORMAL",
    0xf: "THREAD_PRIORITY_TIME_CRITICAL",
    0x10000: "THREAD_MODE_BACKGROUND_BEGIN",
    0x20000: "THREAD_MODE_BACKGROUND_END"
  },
  unmapViewOfFile2_UnmapFlags: {
    0x1: "MEM_UNMAP_WITH_TRANSIENT_BOOST",
    0x2: "MEM_PRESERVE_PLACEHOLDER"
  },
  unmapViewOfFileEx_UnmapFlags: {
    0x1: "MEM_UNMAP_WITH_TRANSIENT_BOOST",
    0x2: "MEM_PRESERVE_PLACEHOLDER"
  },
  virtualAlloc2_AllocationType: {
    0x1000: "MEM_COMMIT",
    0x2000: "MEM_RESERVE",
    0x4000: "MEM_REPLACE_PLACEHOLDER",
    0x40000: "MEM_RESERVE_PLACEHOLDER",
    0x80000: "MEM_RESET",
    0x100000: "MEM_TOP_DOWN",
    0x400000: "MEM_PHYSICAL",
    0x1000000: "MEM_RESET_UNDO",
    0x20000000: "MEM_LARGE_PAGES",
    0x20400000: "MEM_64K_PAGES"
  },
  virtualAlloc2FromApp_AllocationType: {
    0x1000: "MEM_COMMIT",
    0x2000: "MEM_RESERVE",
    0x4000: "MEM_REPLACE_PLACEHOLDER",
    0x40000: "MEM_RESERVE_PLACEHOLDER",
    0x80000: "MEM_RESET",
    0x100000: "MEM_TOP_DOWN",
    0x200000: "MEM_WRITE_WATCH",
    0x400000: "MEM_PHYSICAL",
    0x1000000: "MEM_RESET_UNDO",
    0x20000000: "MEM_LARGE_PAGES"
  },
  virtualAllocExNuma_flAllocationType: {
    0x1000: "MEM_COMMIT",
    0x2000: "MEM_RESERVE",
    0x80000: "MEM_RESET",
    0x100000: "MEM_TOP_DOWN",
    0x400000: "MEM_PHYSICAL",
    0x1000000: "MEM_RESET_UNDO",
    0x20000000: "MEM_LARGE_PAGES"
  },
  virtualAllocFromApp_AllocationType: {
    0x1000: "MEM_COMMIT",
    0x2000: "MEM_RESERVE",
    0x80000: "MEM_RESET",
    0x100000: "MEM_TOP_DOWN",
    0x200000: "MEM_WRITE_WATCH",
    0x400000: "MEM_PHYSICAL",
    0x1000000: "MEM_RESET_UNDO",
    0x20000000: "MEM_LARGE_PAGES"
  }
};

const DOC_HEADER_OVERRIDES = {
  AdjustTokenPrivileges: "securitybaseapi",
  BCryptCloseAlgorithmProvider: "bcrypt",
  BCryptCreateHash: "bcrypt",
  BCryptDestroyHash: "bcrypt",
  BCryptFinishHash: "bcrypt",
  BCryptHashData: "bcrypt",
  BCryptOpenAlgorithmProvider: "bcrypt",
  ChangeServiceConfig: "winsvc",
  CloseHandle: "handleapi",
  CloseServiceHandle: "winsvc",
  ConnectNamedPipe: "namedpipeapi",
  ControlService: "winsvc",
  CopyFile: "winbase",
  CreateDirectory: "fileapi",
  CreateEvent: "synchapi",
  CreateFile: "fileapi",
  CreateFileMapping: "memoryapi",
  CreateMutex: "synchapi",
  CreateNamedPipe: "winbase",
  CreatePipe: "namedpipeapi",
  CreateProcess: "processthreadsapi",
  CreateRemoteThread: "processthreadsapi",
  CreateSemaphore: "winbase",
  CreateService: "winsvc",
  CreateThread: "processthreadsapi",
  CreateToolhelp32Snapshot: "tlhelp32",
  CryptAcquireContext: "wincrypt",
  CryptCreateHash: "wincrypt",
  CryptDecrypt: "wincrypt",
  CryptDeriveKey: "wincrypt",
  CryptDestroyHash: "wincrypt",
  CryptDestroyKey: "wincrypt",
  CryptEncrypt: "wincrypt",
  CryptHashData: "wincrypt",
  CryptReleaseContext: "wincrypt",
  DeleteCriticalSection: "synchapi",
  DeleteFile: "fileapi",
  DeleteService: "winsvc",
  DisconnectNamedPipe: "namedpipeapi",
  DuplicateHandle: "handleapi",
  EnterCriticalSection: "synchapi",
  ExitProcess: "processthreadsapi",
  ExitThread: "processthreadsapi",
  FindClose: "fileapi",
  FindFirstFile: "fileapi",
  FindNextFile: "fileapi",
  FlushInstructionCache: "memoryapi",
  FlushViewOfFile: "memoryapi",
  FreeLibrary: "libloaderapi",
  FreeLibraryAndExitThread: "libloaderapi",
  GetExitCodeProcess: "processthreadsapi",
  GetExitCodeThread: "processthreadsapi",
  GetFileAttributes: "fileapi",
  GetFileSize: "fileapi",
  GetFileSizeEx: "fileapi",
  GetHandleInformation: "handleapi",
  GetLocalTime: "sysinfoapi",
  GetModuleFileName: "libloaderapi",
  GetModuleHandle: "libloaderapi",
  GetModuleHandleEx: "libloaderapi",
  GetProcAddress: "libloaderapi",
  GetProcessHeaps: "heapapi",
  GetProcessId: "processthreadsapi",
  GetSystemDirectory: "sysinfoapi",
  GetSystemTime: "sysinfoapi",
  GetTempFileName: "fileapi",
  GetTempPath: "fileapi",
  GetThreadContext: "processthreadsapi",
  GetThreadId: "processthreadsapi",
  GetThreadPriority: "processthreadsapi",
  GetTokenInformation: "securitybaseapi",
  GetWindowsDirectory: "sysinfoapi",
  GlobalAlloc: "winbase",
  GlobalFree: "winbase",
  GlobalLock: "winbase",
  GlobalReAlloc: "winbase",
  GlobalUnlock: "winbase",
  HeapAlloc: "heapapi",
  HeapCreate: "heapapi",
  HeapDestroy: "heapapi",
  HeapFree: "heapapi",
  HeapReAlloc: "heapapi",
  HeapSize: "heapapi",
  HeapValidate: "heapapi",
  HttpOpenRequest: "wininet",
  HttpQueryInfo: "wininet",
  HttpSendRequest: "wininet",
  InitializeCriticalSection: "synchapi",
  InternetCloseHandle: "wininet",
  InternetConnect: "wininet",
  InternetOpen: "wininet",
  InternetOpenUrl: "wininet",
  InternetQueryOption: "wininet",
  InternetReadFile: "wininet",
  InternetSetOption: "wininet",
  IsWow64Process: "wow64apiset",
  LeaveCriticalSection: "synchapi",
  LoadLibrary: "libloaderapi",
  LoadLibraryEx: "libloaderapi",
  LocalAlloc: "winbase",
  LocalFree: "winbase",
  LocalLock: "winbase",
  LocalUnlock: "winbase",
  LookupPrivilegeValue: "winbase",
  MapViewOfFile: "memoryapi",
  Module32First: "tlhelp32",
  Module32Next: "tlhelp32",
  MoveFile: "winbase",
  OpenEvent: "synchapi",
  OpenFileMapping: "memoryapi",
  OpenMutex: "synchapi",
  OpenProcess: "processthreadsapi",
  OpenProcessToken: "processthreadsapi",
  OpenSCManager: "winsvc",
  OpenSemaphore: "synchapi",
  OpenService: "winsvc",
  OpenThread: "processthreadsapi",
  PeekNamedPipe: "namedpipeapi",
  Process32First: "tlhelp32",
  Process32Next: "tlhelp32",
  PulseEvent: "synchapi",
  QueryPerformanceCounter: "profileapi",
  QueryPerformanceFrequency: "profileapi",
  QueryServiceStatus: "winsvc",
  QueueUserAPC: "processthreadsapi",
  ReadFile: "fileapi",
  ReadProcessMemory: "memoryapi",
  RegCloseKey: "winreg",
  RegCreateKeyEx: "winreg",
  RegDeleteKey: "winreg",
  RegDeleteValue: "winreg",
  RegEnumKeyEx: "winreg",
  RegEnumValue: "winreg",
  RegFlushKey: "winreg",
  RegOpenKeyEx: "winreg",
  RegQueryValueEx: "winreg",
  RegSetValueEx: "winreg",
  ReleaseMutex: "synchapi",
  ReleaseSemaphore: "synchapi",
  RemoveDirectory: "fileapi",
  ResetEvent: "synchapi",
  ResumeThread: "processthreadsapi",
  SetEndOfFile: "fileapi",
  SetEvent: "synchapi",
  SetFileAttributes: "fileapi",
  SetFilePointer: "fileapi",
  SetFilePointerEx: "fileapi",
  SetHandleInformation: "handleapi",
  SetThreadContext: "processthreadsapi",
  SetThreadPriority: "processthreadsapi",
  ShellExecute: "shellapi",
  Sleep: "synchapi",
  SleepEx: "synchapi",
  StartService: "winsvc",
  SuspendThread: "processthreadsapi",
  TerminateProcess: "processthreadsapi",
  Thread32First: "tlhelp32",
  Thread32Next: "tlhelp32",
  UnmapViewOfFile: "memoryapi",
  VirtualAlloc: "memoryapi",
  VirtualAllocEx: "memoryapi",
  VirtualFree: "memoryapi",
  VirtualFreeEx: "memoryapi",
  VirtualLock: "memoryapi",
  VirtualProtect: "memoryapi",
  VirtualProtectEx: "memoryapi",
  VirtualQuery: "memoryapi",
  VirtualQueryEx: "memoryapi",
  VirtualUnlock: "memoryapi",
  WaitForMultipleObjects: "synchapi",
  WaitForSingleObject: "synchapi",
  WaitForSingleObjectEx: "synchapi",
  WinExec: "winbase",
  WriteFile: "fileapi",
  WriteProcessMemory: "memoryapi",
  accept: "winsock2",
  bind: "winsock2",
  closesocket: "winsock2",
  connect: "winsock2",
  freeaddrinfo: "ws2tcpip",
  getaddrinfo: "ws2tcpip",
  gethostbyname: "winsock2",
  htons: "winsock2",
  inet_addr: "winsock2",
  listen: "winsock2",
  recv: "winsock2",
  send: "winsock2",
  shutdown: "winsock2",
  socket: "winsock2",
  WSASocket: "winsock2",
  WSAStartup: "winsock2"
};

let CATALOG = [];

const COMMON_VALUES = [
  { label: "Manual", value: "" },
  { label: "Unknown", value: "unknown" },
  { label: "NULL / 0", value: "0" },
  { label: "TRUE / 1", value: "1" },
  { label: "INFINITE", value: "0xffffffff" },
  { label: "MEM_COMMIT", value: "0x1000" },
  { label: "MEM_RESERVE", value: "0x2000" },
  { label: "MEM_COMMIT | MEM_RESERVE", value: "0x3000" },
  { label: "MEM_RELEASE", value: "0x8000" },
  { label: "PAGE_READWRITE", value: "0x04" },
  { label: "PAGE_EXECUTE_READ", value: "0x20" },
  { label: "PAGE_EXECUTE_READWRITE", value: "0x40" },
  { label: "GENERIC_READ", value: "0x80000000" },
  { label: "GENERIC_WRITE", value: "0x40000000" },
  { label: "GENERIC_READ | GENERIC_WRITE", value: "0xC0000000" },
  { label: "FILE_SHARE_READ", value: "0x1" },
  { label: "FILE_SHARE_READ | FILE_SHARE_WRITE", value: "0x3" },
  { label: "OPEN_EXISTING", value: "3" },
  { label: "CREATE_ALWAYS", value: "2" },
  { label: "PROCESS_ALL_ACCESS", value: "0x1f0fff" },
  { label: "PROCESS_VM_OPERATION | WRITE", value: "0x28" },
  { label: "THREAD_ALL_ACCESS", value: "0x1f03ff" },
  { label: "AF_INET", value: "2" },
  { label: "SOCK_STREAM", value: "1" },
  { label: "IPPROTO_TCP", value: "6" }
];

const els = {
  assemblyInput: document.querySelector("#assemblyInput"),
  codeHighlight: document.querySelector("#codeHighlight"),
  parsedArgs: document.querySelector("#parsedArgs"),
  matchBtn: document.querySelector("#matchBtn"),
  manualTab: document.querySelector("#manualTab"),
  pasteTab: document.querySelector("#pasteTab"),
  manualPanel: document.querySelector("#manualPanel"),
  pastePanel: document.querySelector("#pastePanel"),
  paramCount: document.querySelector("#paramCount"),
  countButtons: [...document.querySelectorAll(".count-button")],
  paramInputs: document.querySelector("#paramInputs"),
  reverseArgs: document.querySelector("#reverseArgs"),
  clearArgs: document.querySelector("#clearArgs"),
  catalogMeta: document.querySelector("#catalogMeta"),
  resultMeta: document.querySelector("#resultMeta"),
  results: document.querySelector("#results"),
  paramTemplate: document.querySelector("#paramTemplate")
};

const ASM_MNEMONICS = new Set([
  "push", "pop", "mov", "movzx", "movsx", "lea", "call", "ret", "retn",
  "jmp", "jz", "jnz", "je", "jne", "ja", "jae", "jb", "jbe", "jg", "jge", "jl",
  "jle", "jc", "jnc", "jo", "jno", "js", "jns", "jp", "jnp", "loop",
  "xor", "or", "and", "not", "neg", "add", "sub", "adc", "sbb", "inc", "dec",
  "mul", "imul", "div", "idiv", "cmp", "test", "shl", "shr", "sar", "sal",
  "rol", "ror", "rcl", "rcr", "nop", "int", "syscall", "sysenter",
  "pushad", "popad", "pushfd", "popfd", "pusha", "popa", "pushf", "popf",
  "stosb", "stosw", "stosd", "stosq", "lodsb", "lodsw", "lodsd", "lodsq",
  "movsb", "movsw", "movsd", "movsq", "cmpsb", "scasb", "rep", "repe", "repne",
  "repz", "repnz", "cld", "std", "cli", "sti", "leave", "enter", "hlt",
  "cdq", "cdqe", "cwde", "cbw", "xchg", "bswap", "setz", "setnz", "sete",
  "setne", "fld", "fst", "fstp", "fadd", "fmul", "fsub", "fdiv"
]);

const ASM_REGISTERS = new Set([
  "rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp", "rip",
  "eax", "ebx", "ecx", "edx", "esi", "edi", "ebp", "esp", "eip",
  "ax", "bx", "cx", "dx", "si", "di", "bp", "sp",
  "al", "ah", "bl", "bh", "cl", "ch", "dl", "dh", "sil", "dil", "bpl", "spl",
  "r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15",
  "r8d", "r9d", "r10d", "r11d", "r12d", "r13d", "r14d", "r15d",
  "r8w", "r9w", "r10w", "r11w", "r12w", "r13w", "r14w", "r15w",
  "r8b", "r9b", "r10b", "r11b", "r12b", "r13b", "r14b", "r15b",
  "cs", "ds", "es", "fs", "gs", "ss",
  "xmm0", "xmm1", "xmm2", "xmm3", "xmm4", "xmm5", "xmm6", "xmm7"
]);

const ASM_KEYWORDS = new Set([
  "dword", "qword", "word", "byte", "tbyte", "xmmword", "ptr",
  "offset", "short", "near", "far", "large", "small"
]);

let currentValues = [];
let currentCount = 0;
let currentResults = [];
let selectedResultName = "";
let disassemblyAnalysis = { fromPaste: false, argStorages: [], returnStorage: "eax" };

function setParamCount(n) {
  const next = Math.max(0, Math.min(12, Math.floor(n) || 0));
  currentCount = next;
  els.paramCount.value = next >= 7 ? String(next) : "";
}

async function loadCatalog() {
  try {
    const response = await fetch("catalog.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`catalog.json: HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("catalog.json: expected an array");
    CATALOG = data;
  } catch (err) {
    console.error("Failed to load catalog.json", err);
    CATALOG = [];
  }
}

let urlUpdateTimer = 0;
let suppressUrlUpdates = false;

function currentMode() {
  return els.pastePanel.hidden ? "manual" : "paste";
}

function b64UrlEncode(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64UrlDecode(b64) {
  try {
    const padded = b64.replace(/-/g, "+").replace(/_/g, "/");
    const full = padded + "=".repeat((4 - (padded.length % 4)) % 4);
    const binary = atob(full);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

function serializeStateToHash() {
  if (suppressUrlUpdates) return;
  const params = new URLSearchParams();
  if (currentMode() === "paste") {
    if (els.assemblyInput.value) params.set("asm", b64UrlEncode(els.assemblyInput.value));
  } else if (currentValues.length) {
    params.set("args", currentValues.map(encodeURIComponent).join("|"));
  }
  const hash = params.toString();
  const next = hash
    ? `${window.location.pathname}${window.location.search}#${hash}`
    : `${window.location.pathname}${window.location.search}`;
  if (next !== window.location.pathname + window.location.search + window.location.hash) {
    history.replaceState(null, "", next);
  }
}

function scheduleUrlUpdate() {
  clearTimeout(urlUpdateTimer);
  urlUpdateTimer = setTimeout(serializeStateToHash, 200);
}

function applyHashState() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return false;
  const params = new URLSearchParams(hash);
  suppressUrlUpdates = true;
  try {
    if (params.has("asm")) {
      setMode("paste");
      els.assemblyInput.value = b64UrlDecode(params.get("asm"));
      parseAssembly();
      return true;
    }
    if (params.has("args")) {
      const values = params.get("args").split("|").map(decodeURIComponent);
      currentValues = values;
      setParamCount(values.length);
      setMode("manual");
      renderParamInputs();
      runSearch({ resetSelection: true });
      return true;
    }
  } finally {
    suppressUrlUpdates = false;
  }
  return false;
}

function toHex(value) {
  if (value === null || Number.isNaN(value)) return "";
  const unsigned = value >>> 0;
  return `0x${unsigned.toString(16).toUpperCase()}`;
}

function parseNumber(raw) {
  if (!raw) return null;
  let s = raw.trim().replace(/[`_]/g, "");
  if (!s) return null;
  if (/^(unknown|\?|unk)$/i.test(s)) return null;
  if (/^null$/i.test(s)) return 0;
  s = s.replace(/^offset\s+/i, "");
  s = s.replace(/^large\s+/i, "");
  s = s.split(/\s/)[0].replace(/,$/, "");
  if (/^-?0x[0-9a-f]+$/i.test(s)) return Number.parseInt(s, 16);
  if (/^-?[0-9a-f]+h$/i.test(s)) {
    const sign = s.startsWith("-") ? -1 : 1;
    const body = s.replace(/^-/, "").slice(0, -1);
    return sign * Number.parseInt(body, 16);
  }
  if (/^-?\d+$/.test(s)) return Number.parseInt(s, 10);
  return null;
}

function parseArgument(raw) {
  const text = String(raw ?? "").trim();
  if (!text || /^(unknown|\?|unk)$/i.test(text)) {
    return { raw: text || "unknown", unknown: true, value: null };
  }
  const value = parseNumber(text);
  if (value === null) {
    return { raw: text, unknown: true, value: null };
  }
  return { raw: text, unknown: false, value };
}

function classifyArgument(arg) {
  if (arg.unknown) return "unknown";
  if (arg.value === null) return "unparsed";
  return classifyValue(arg.value);
}

function classifyValue(value) {
  if (value === null) return "unparsed";
  if (value === 0) return "NULL";
  if (value === 1 || value === 0xffffffff) return toHex(value);
  if (value > 0 && value < 0x10000) return "small";
  if (value >= 0x10000 && value < 0x80000000) return "pointer/size";
  return toHex(value);
}

function flagNames(group, value) {
  const defs = FLAG_DEFS[group];
  if (!defs || value === null) return [];
  const normalized = normalizeConstantValue(value);
  if (Object.prototype.hasOwnProperty.call(defs, normalized)) return [defs[normalized]];
  const names = [];
  let remaining = normalized >>> 0;
  Object.keys(defs)
    .map(Number)
    .filter((bit) => bit > 0 && (((remaining & bit) >>> 0) === (bit >>> 0)))
    .sort((a, b) => b - a)
    .forEach((bit) => {
      names.push(defs[bit]);
      remaining = (remaining & ~bit) >>> 0;
    });
  return names;
}

function flagResult(group, value) {
  const defs = FLAG_DEFS[group];
  if (!defs || value === null) return { names: [], remaining: value >>> 0, exact: false };
  const normalized = normalizeConstantValue(value);
  if (Object.prototype.hasOwnProperty.call(defs, normalized)) {
    return { names: [defs[normalized]], remaining: 0, exact: true };
  }
  const names = [];
  let remaining = normalized >>> 0;
  Object.keys(defs)
    .map(Number)
    .filter((bit) => bit > 0 && (((remaining & bit) >>> 0) === (bit >>> 0)))
    .sort((a, b) => b - a)
    .forEach((bit) => {
      names.push(defs[bit]);
      remaining = (remaining & ~bit) >>> 0;
    });
  return { names, remaining, exact: false };
}

function isPointerish(value) {
  return value >= 0x10000 && value < 0x80000000;
}

function normalizeConstantValue(value) {
  return value < 0 ? value >>> 0 : value;
}

function scoreParam(spec, arg) {
  if (arg.unknown) return { score: 0, note: "unknown", compatible: true, neutral: true };
  if (arg.value === null) return { score: 0, note: "unparsed value", compatible: false };

  const value = arg.value;
  const constantValue = normalizeConstantValue(value);

  const isNull = value === 0;
  const isSmall = value > 0 && value < 0x10000;
  const pointerShape = isPointerish(value);
  const exact = spec.exactGood?.includes(value) || spec.exactGood?.includes(constantValue);
  const flags = spec.flags ? flagResult(spec.flags, value) : { names: [], remaining: 0, exact: false };
  const names = flags.names;
  const pointerKinds = ["ptr", "stringptr", "codeptr", "outptr", "handle"];

  if (isNull && !spec.nullGood && !spec.zeroGood && pointerKinds.includes(spec.kind)) {
    return { score: 0, note: "NULL is not accepted here", compatible: false };
  }

  if (value < 0 && ["ptr", "stringptr", "codeptr", "outptr"].includes(spec.kind)) {
    return { score: 0, note: "negative immediate is not pointer-shaped", compatible: false };
  }

  if (value < 0 && spec.kind === "handle" && !spec.invalidHandleGood) {
    return { score: 0, note: "INVALID_HANDLE_VALUE is not accepted here", compatible: false };
  }

  if (spec.kind === "bool" && value !== 0 && value !== 1) {
    return { score: 0, note: "not a BOOL value", compatible: false };
  }

  if (spec.kind === "enum" && spec.flags && !flags.exact && !exact) {
    return { score: 0, note: "unsupported enum value", compatible: false };
  }

  if (spec.kind === "flags" && spec.flags && value !== 0) {
    if (!names.length && !exact) {
      return { score: 0, note: "unsupported flag value", compatible: false };
    }
    if (flags.remaining && !exact && !spec.allowUnknownBits) {
      return { score: 0, note: "unsupported flag bits", compatible: false };
    }
  }

  if (spec.kind === "size" && value === 0 && !spec.zeroGood) {
    return { score: 0, note: "zero size is not accepted here", compatible: false };
  }

  if (spec.kind === "size" && value < 0) {
    return { score: 0, note: "negative size is not accepted here", compatible: false };
  }

  if (spec.nonNegative && value < 0) {
    return { score: 0, note: "negative value is not accepted here", compatible: false };
  }

  let score = 0;
  const notes = [];

  if (spec.nullGood && isNull) {
    score += 18;
    notes.push("NULL accepted");
  } else if (isNull) {
    if (spec.zeroGood || ["integer", "flags", "bool"].includes(spec.kind)) {
      score += 8;
      notes.push("zero plausible");
    }
  }

  if (exact) {
    score += 34;
    notes.push(names.length ? names.slice(0, 3).join(" | ") : "known constant");
  } else if (names.length) {
    score += spec.kind === "enum" ? 30 : 24;
    notes.push(names.slice(0, 3).join(" | "));
  }

  if (spec.kind === "bool") {
    score += value === 0 || value === 1 ? 18 : -16;
    notes.push(value === 0 || value === 1 ? "boolean shape" : "not boolean-shaped");
  }

  if (spec.kind === "size") {
    if (isSmall || pointerShape) score += 12;
    if (value > 0) notes.push("size-like");
  }

  if (spec.kind === "ptr" || spec.kind === "stringptr" || spec.kind === "codeptr" || spec.kind === "outptr" || spec.kind === "handle") {
    if (pointerShape) {
      score += spec.kind === "handle" ? 10 : 16;
      notes.push(spec.kind === "stringptr" ? "string pointer shape" : spec.kind === "codeptr" ? "code pointer shape" : "pointer shape");
    } else if (isSmall && !isNull) {
      if (spec.kind === "handle") {
        score += 4;
        notes.push("small handle-like value");
      } else {
        return { score: 0, note: "small value is not pointer-shaped", compatible: false };
      }
    }
  }

  if (spec.kind === "flags" && !names.length && !exact) {
    if (isSmall || value > 0x10000) score += 4;
    notes.push("flag-sized value");
  }

  if (spec.kind === "enum" && !names.length) {
    score += isSmall ? 5 : -8;
    notes.push(isSmall ? "small enum-like value" : "large enum value");
  }

  if (spec.kind === "integer") {
    score += 7;
    notes.push("integer");
  }

  if (!notes.length) notes.push("compatible");
  return { score, note: notes.join(", "), compatible: true };
}

function maxScoreForParam(spec) {
  const k = spec.kind;
  if (k === "flags") return spec.exactGood ? 34 : (spec.flags ? 24 : 4);
  if (k === "enum") return spec.exactGood ? 34 : 30;
  if (k === "bool") return 18;
  if (k === "ptr" || k === "stringptr" || k === "codeptr" || k === "outptr") return spec.nullGood ? 18 : 16;
  if (k === "handle") return spec.nullGood ? 18 : 10;
  if (k === "size") return 12;
  if (k === "integer") return 7;
  return 10;
}

function scoreApi(entry, args) {
  if (entry.params.length !== args.length) return null;

  const base = 44;
  let score = base;
  let maxScore = base;
  const evidence = [];

  for (let i = 0; i < entry.params.length; i += 1) {
    const result = scoreParam(entry.params[i], args[i]);
    if (!result.compatible) return null;
    score += result.score;
    if (!result.neutral) {
      maxScore += maxScoreForParam(entry.params[i]);
    }
    evidence.push({
      index: i + 1,
      signature: entry.signature[i],
      arg: args[i],
      kind: entry.params[i].kind,
      note: result.note,
      score: result.score,
      neutral: result.neutral
    });
  }

  if (entry.name === "VirtualAlloc" && args.length === 4) {
    if (args[0].value === 0) { score += 10; maxScore += 10; }
    else if (!args[0].unknown) maxScore += 10;
    if (args[2].value === 0x3000) { score += 18; maxScore += 18; }
    else if (!args[2].unknown) maxScore += 18;
    if (args[3].value === 0x40) { score += 20; maxScore += 20; }
    else if (!args[3].unknown) maxScore += 20;
  }

  if (entry.system) { score += 2; maxScore += 2; }

  const percent = Math.round((score / maxScore) * 100);
  const clamped = Math.max(0, Math.min(100, percent));
  const confidence = clamped >= 85 ? "Strong" : clamped >= 60 ? "Possible" : "Loose";
  return { ...entry, score: clamped, confidence, evidence };
}

function analyzeDisassembly(text) {
  const pushes = [];
  const registers = [];
  const stackArgs = [];
  const lines = text.split(/\r?\n/);
  let callTarget = "";
  for (const [lineIndex, line] of lines.entries()) {
    const noComment = line.split(";")[0];
    const pushMatch = noComment.match(/\bpush(?:\s+(?:dword|qword|word|byte)\s+ptr)?\s+(\[[^\]]+\]|[^,\]]+)/i);
    if (pushMatch) pushes.push({ raw: pushMatch[1].trim(), storage: "stack", lineIndex });

    const stackMatch = noComment.match(/\b(?:mov|lea)\s+(?:qword|dword|word|byte)?\s*(?:ptr\s*)?\[(?:r|e)sp\s*\+\s*([0-9a-f]+h|0x[0-9a-f]+|\d+)\]\s*,\s*(.+)$/i);
    if (stackMatch) {
      stackArgs.push({
        offset: parseNumber(stackMatch[1]),
        raw: stackMatch[2].replace(/,$/, "").trim(),
        storage: `rsp+${formatStackOffset(stackMatch[1])}`,
        lineIndex
      });
    }

    const movMatch = noComment.match(/\b(?:mov|lea)\s+((?:[re])?(?:ax|bx|cx|dx|si|di|bp|sp)|r(?:8|9|10|11|12|13|14|15)(?:d|w|b)?)\s*,\s*(.+)$/i);
    if (movMatch) {
      registers.push({
        register: normalizeRegister(movMatch[1]),
        raw: movMatch[2].replace(/,$/, "").trim(),
        lineIndex
      });
    }

    const zeroMatch = noComment.match(/\b(?:xor|sub)\s+((?:[re])?(?:ax|bx|cx|dx|si|di)|r(?:8|9|10|11|12|13|14|15)(?:d|w|b)?)\s*,\s*\1\b/i);
    if (zeroMatch) {
      registers.push({ register: normalizeRegister(zeroMatch[1]), raw: "0", lineIndex });
    }

    const callMatch = noComment.match(/\bcall\s+(.+)$/i);
    if (callMatch) callTarget = callMatch[1].trim();
  }

  const x64Args = inferX64Arguments(registers, stackArgs);
  if (x64Args.length) {
    return {
      fromPaste: true,
      values: x64Args.map((item) => item.raw),
      argStorages: x64Args.map((item) => item.storage),
      registerWrites: registers,
      callTarget,
      returnStorage: "rax"
    };
  }

  const orderedPushes = [...pushes].reverse();
  if (orderedPushes.length) {
    return {
      fromPaste: true,
      values: orderedPushes.map((item) => item.raw),
      argStorages: orderedPushes.map((item) => item.storage),
      registerWrites: registers,
      callTarget,
      returnStorage: "eax"
    };
  }

  const registerArgs = inferRegisterArguments(registers);
  return {
    fromPaste: true,
    values: registerArgs.map((item) => item.raw),
    argStorages: registerArgs.map((item) => item.register),
    registerWrites: registers,
    callTarget,
    returnStorage: usesX64Registers(registers) ? "rax" : "eax"
  };
}

function normalizeRegister(register) {
  const normalized = register.toLowerCase();
  const aliases = {
    r8d: "r8",
    r8w: "r8",
    r8b: "r8",
    r9d: "r9",
    r9w: "r9",
    r9b: "r9"
  };
  return aliases[normalized] || normalized;
}

function usesX64Registers(registers) {
  return registers.some((item) => /^r(?:[a-z]+|[8-9]|1[0-5])$/.test(item.register));
}

function inferX64Arguments(registers, stackArgs) {
  const latestByRegister = new Map();
  for (const item of registers) latestByRegister.set(item.register, item);
  const hasX64Cue = stackArgs.length > 0 || registers.some((item) => /^(?:r(?:cx|dx|8|9)|r(?:8|9)|r(?:8|9)[dwb]?)$/.test(item.register));
  if (!hasX64Cue) return [];
  const registerOrder = [
    ["rcx", "ecx"],
    ["rdx", "edx"],
    ["r8"],
    ["r9"]
  ];
  const registerArgs = registerOrder
    .map((variants) => {
      const found = variants.find((register) => latestByRegister.has(register));
      return found ? { ...latestByRegister.get(found), storage: variants[0] } : null;
    })
    .filter(Boolean);
  const orderedStackArgs = stackArgs
    .filter((item) => Number.isFinite(item.offset) && item.offset >= 0x20)
    .sort((a, b) => a.offset - b.offset || a.lineIndex - b.lineIndex);
  if (!registerArgs.length && !orderedStackArgs.length) return [];
  return [...registerArgs, ...orderedStackArgs];
}

function formatStackOffset(rawOffset) {
  const parsed = parseNumber(rawOffset);
  if (parsed === null) return rawOffset;
  return `0x${parsed.toString(16)}`;
}

function inferRegisterArguments(registers) {
  const latestByRegister = new Map();
  for (const item of registers) latestByRegister.set(item.register, item);
  const x64Order = ["rcx", "rdx", "r8", "r9"].filter((register) => latestByRegister.has(register));
  if (x64Order.length) return x64Order.map((register) => latestByRegister.get(register));
  return [...latestByRegister.values()].sort((a, b) => a.lineIndex - b.lineIndex);
}

function recoverArgumentStorages(values, analysis) {
  if (analysis.argStorages?.length === values.length && analysis.argStorages.every((storage) => storage !== "stack")) {
    return analysis.argStorages;
  }

  const storages = values.map((_, index) => analysis.argStorages?.[index] || "stack");
  const parsedArgs = values.map(parseArgument);
  const latestRegisterWrites = [...analysis.registerWrites]
    .sort((a, b) => b.lineIndex - a.lineIndex)
    .filter((item, index, list) => list.findIndex((candidate) => candidate.register === item.register) === index);

  parsedArgs.forEach((arg, index) => {
    if (arg.unknown || arg.value === null || arg.value === 0) return;
    const matches = latestRegisterWrites.filter((item) => {
      const registerArg = parseArgument(item.raw);
      if (registerArg.value !== null) return registerArg.value === arg.value;
      return normalizeOperand(item.raw) === normalizeOperand(values[index]);
    });
    if (matches.length === 1) storages[index] = matches[0].register;
  });

  return storages;
}

function normalizeOperand(value) {
  return String(value)
    .trim()
    .replace(/^(?:offset|large)\s+/i, "")
    .replace(/\s+/g, "")
    .replace(/,$/, "")
    .toLowerCase();
}

function setMode(mode) {
  const manual = mode === "manual";
  els.manualTab.classList.toggle("active", manual);
  els.pasteTab.classList.toggle("active", !manual);
  els.manualTab.setAttribute("aria-selected", String(manual));
  els.pasteTab.setAttribute("aria-selected", String(!manual));
  els.manualPanel.hidden = !manual;
  els.pastePanel.hidden = manual;
  els.manualPanel.classList.toggle("active", manual);
  els.pastePanel.classList.toggle("active", !manual);
  scheduleUrlUpdate();
}

function parseAssembly() {
  const parsed = analyzeDisassembly(els.assemblyInput.value);
  disassemblyAnalysis = parsed;
  if (parsed.registerWrites?.length) {
    disassemblyAnalysis.argStorages = recoverArgumentStorages(parsed.values, parsed);
  }
  renderHighlight();
  if (!parsed.values.length) {
    currentValues = [];
    setParamCount(0);
    renderParamInputs();
    runSearch({ resetSelection: true });
    return;
  }
  currentValues = parsed.values.map((value) => (parseArgument(value).unknown ? "unknown" : value));
  setParamCount(parsed.values.length);
  renderParamInputs();
  runSearch({ resetSelection: true });
}

function renderHighlight() {
  if (!els.codeHighlight) return;
  const text = els.assemblyInput.value;
  els.codeHighlight.innerHTML = highlightAsm(text) + "\n";
  syncCodeScroll();
  updateOverflowState();
}

function syncCodeScroll() {
  const pre = els.codeHighlight?.parentElement;
  if (!pre) return;
  pre.scrollLeft = els.assemblyInput.scrollLeft;
  pre.scrollTop = els.assemblyInput.scrollTop;
}

function updateOverflowState() {
  const editor = els.codeHighlight?.closest(".code-editor");
  const ta = els.assemblyInput;
  if (!editor || !ta) return;
  const overflowsRight = ta.scrollWidth - ta.clientWidth - ta.scrollLeft > 2;
  editor.classList.toggle("has-overflow", overflowsRight);
}

function highlightAsm(text) {
  if (!text) return "";
  return text.split("\n").map(highlightAsmLine).join("\n");
}

function highlightAsmLine(line) {
  let out = "";
  let i = 0;
  while (i < line.length) {
    const ch = line[i];
    const rest = line.slice(i);

    if (ch === ";") {
      out += `<span class="hl-cmt">${escapeHtml(rest)}</span>`;
      break;
    }

    if (/\s/.test(ch)) {
      const ws = rest.match(/^\s+/)[0];
      out += ws;
      i += ws.length;
      continue;
    }

    if (ch === "'" || ch === '"') {
      const end = rest.indexOf(ch, 1);
      const lit = end > 0 ? rest.slice(0, end + 1) : rest;
      out += `<span class="hl-str">${escapeHtml(lit)}</span>`;
      i += lit.length;
      continue;
    }

    const addr = rest.match(/^\.[A-Za-z_][\w]*:[0-9A-Fa-f]+/);
    if (addr) {
      out += `<span class="hl-addr">${escapeHtml(addr[0])}</span>`;
      i += addr[0].length;
      continue;
    }

    if (ch === "[") {
      const end = rest.indexOf("]");
      if (end > 0) {
        out += `<span class="hl-mem">${highlightMemoryOperand(rest.slice(0, end + 1))}</span>`;
        i += end + 1;
        continue;
      }
    }

    const num = rest.match(/^(?:0x[0-9A-Fa-f]+|[0-9][0-9A-Fa-f]*h|-?\d+)\b/);
    if (num) {
      out += `<span class="hl-num">${escapeHtml(num[0])}</span>`;
      i += num[0].length;
      continue;
    }

    const word = rest.match(/^[A-Za-z_][\w]*/);
    if (word) {
      const w = word[0];
      const lw = w.toLowerCase();
      if (ASM_MNEMONICS.has(lw)) {
        out += `<span class="hl-mnem">${escapeHtml(w)}</span>`;
      } else if (ASM_REGISTERS.has(lw)) {
        out += `<span class="hl-reg">${escapeHtml(w)}</span>`;
      } else if (ASM_KEYWORDS.has(lw)) {
        out += `<span class="hl-kw">${escapeHtml(w)}</span>`;
      } else {
        out += `<span class="hl-ident">${escapeHtml(w)}</span>`;
      }
      i += w.length;
      continue;
    }

    out += escapeHtml(ch);
    i += 1;
  }
  return out;
}

function highlightMemoryOperand(text) {
  const inner = text.slice(1, -1);
  let html = "[";
  let i = 0;
  while (i < inner.length) {
    const rest = inner.slice(i);
    const word = rest.match(/^[A-Za-z_][\w]*/);
    if (word) {
      const w = word[0];
      const lw = w.toLowerCase();
      if (ASM_REGISTERS.has(lw)) {
        html += `<span class="hl-reg">${escapeHtml(w)}</span>`;
      } else {
        html += `<span class="hl-ident">${escapeHtml(w)}</span>`;
      }
      i += w.length;
      continue;
    }
    const num = rest.match(/^(?:0x[0-9A-Fa-f]+|[0-9][0-9A-Fa-f]*h|\d+)/);
    if (num) {
      html += `<span class="hl-num">${escapeHtml(num[0])}</span>`;
      i += num[0].length;
      continue;
    }
    html += escapeHtml(inner[i]);
    i += 1;
  }
  html += "]";
  return html;
}

function renderParsedArgs() {
  if (!els.parsedArgs) return;
  const values = disassemblyAnalysis.values || (disassemblyAnalysis.fromPaste ? currentValues : []);
  const storages = disassemblyAnalysis.argStorages || [];
  if (!disassemblyAnalysis.fromPaste || !values.length) {
    els.parsedArgs.hidden = true;
    els.parsedArgs.innerHTML = "";
    return;
  }
  els.parsedArgs.hidden = false;
  const rows = values.map((value, i) => {
    const arg = parseArgument(value);
    const storage = storages[i] || "stack";
    const isUnknown = arg.unknown;
    const display = isUnknown ? "unknown" : value;
    return `<div class="parsed-arg-row${isUnknown ? " is-unknown" : ""}">
      <span class="parsed-arg-index">arg ${i}</span>
      <span class="parsed-arg-storage">${escapeHtml(storage)}</span>
      <span class="parsed-arg-value">${escapeHtml(display)}</span>
    </div>`;
  }).join("");
  els.parsedArgs.innerHTML = `
    <div class="section-kicker">
      <svg viewBox="0 0 24 24" aria-hidden="true" class="kicker-icon">
        <polyline points="3 12 7 8 7 11 17 11 17 8 21 12 17 16 17 13 7 13 7 16 3 12"/>
      </svg>
      Parsed arguments
    </div>
    <div class="parsed-args-list">${rows}</div>
  `;
}

function syncCountButtons() {
  els.countButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.count) === currentCount);
  });
}

function renderParamInputs() {
  const count = currentCount;
  while (currentValues.length < count) currentValues.push("");
  currentValues = currentValues.slice(0, count);
  syncCountButtons();
  els.paramInputs.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const row = els.paramTemplate.content.firstElementChild.cloneNode(true);
    const arg = parseArgument(currentValues[i]);
    row.querySelector(".param-label").textContent = `arg ${i}`;
    const input = row.querySelector(".param-value");
    input.value = currentValues[i] ?? "";
    input.classList.toggle("is-unknown", arg.unknown);
    input.placeholder = "hex or dec";
    input.addEventListener("input", () => {
      disassemblyAnalysis = { fromPaste: false, argStorages: [], returnStorage: "eax" };
      currentValues[i] = input.value;
      input.classList.toggle("is-unknown", parseArgument(input.value).unknown);
      runSearch({ resetSelection: true });
    });
    row.querySelectorAll(".quick-value").forEach((button) => {
      button.addEventListener("click", () => {
        disassemblyAnalysis = { fromPaste: false, argStorages: [], returnStorage: "eax" };
        currentValues[i] = button.dataset.value;
        input.value = currentValues[i];
        input.classList.toggle("is-unknown", parseArgument(currentValues[i]).unknown);
        runSearch({ resetSelection: true });
      });
    });
    els.paramInputs.append(row);
  }
}

function runSearch({ resetSelection = false } = {}) {
  const args = currentValues.map(parseArgument);

  const ranked = CATALOG
    .map((entry) => scoreApi(entry, args))
    .filter(Boolean)
    .filter((entry) => entry.score >= 36)
    .sort((a, b) => b.score - a.score || a.params.length - b.params.length || a.name.localeCompare(b.name))
    .slice(0, 18);

  currentResults = ranked;
  let selectedIndex = resetSelection ? 0 : ranked.findIndex((entry) => entry.name === selectedResultName);
  if (selectedIndex === -1) selectedIndex = 0;
  selectedResultName = ranked[selectedIndex]?.name || "";

  els.resultMeta.textContent = `${ranked.length} ranked`;
  renderResults(ranked, selectedIndex);
  renderParsedArgs();
  scheduleUrlUpdate();
}

function renderResults(results, selectedIndex = 0) {
  els.results.innerHTML = "";
  if (!results.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const hasInput = currentValues.some((v) => v && !/^(unknown|\?|unk)$/i.test(String(v)));
    empty.textContent = hasInput
      ? "No compatible APIs for these arguments."
      : "Input arguments or paste disassembly to start a search.";
    els.results.append(empty);
    return;
  }

  results.forEach((entry, index) => {
    const card = document.createElement("article");
    card.style.setProperty("--score-color", scoreColor(entry.score));
    card.style.setProperty("--score-bg", scoreBackground(entry.score));
    if (index === selectedIndex) {
      card.className = "candidate-card is-selected";
      const variants = nameVariants(entry.name);
      const namesHtml = variants.map((name, variantIndex) => `
        ${variantIndex > 0 ? '<span class="name-separator">/</span>' : ""}
        <span class="candidate-name-item">
          <h3>${escapeHtml(name)}</h3>
          <button class="copy-icon" type="button" data-copy="${escapeHtml(name)}" title="Copy ${escapeHtml(name)}" aria-label="Copy ${escapeHtml(name)}">${copyIconSvg()}</button>
        </span>
      `).join("");
      const signaturesHtml = variants.map((name) => {
        const signature = formatSignature(entry, name);
        return `
          <div class="candidate-signature">
            <span class="prototype-text">${escapeHtml(signature)}</span>
            <button class="copy-button" type="button" data-copy="${escapeHtml(signature)}" title="Copy the ${escapeHtml(name)} prototype to the clipboard" aria-label="Copy ${escapeHtml(name)} prototype">${copyIconSvg()} copy</button>
          </div>
        `;
      }).join("");
      const idaPrototypesHtml = variants.map((name) => {
        const idaPrototype = formatIdaPrototype(entry, name);
        return `
          <div class="ida-prototype">
            <span class="prototype-text">${escapeHtml(idaPrototype)}</span>
            <button class="copy-button" type="button" data-copy="${escapeHtml(idaPrototype)}" title="Copy the IDA-compatible function-pointer prototype for ${escapeHtml(name)}" aria-label="Copy IDA prototype for ${escapeHtml(name)}">${copyIconSvg()} copy</button>
          </div>
        `;
      }).join("");
      const evidenceHtml = entry.evidence.map((item) => {
        const detail = describeEvidence(item);
        return `
          <div class="evidence-line">
            <div class="evidence-value">${escapeHtml(displayArgValue(item.arg))}</div>
            <div>
              <div class="evidence-main">${escapeHtml(detail.main)}</div>
              <div class="evidence-note">${escapeHtml(detail.note)}</div>
            </div>
          </div>
        `;
      }).join("");
      card.innerHTML = `
        <div class="candidate-head">
          <div>
            <div class="candidate-title">
              <div class="candidate-names">${namesHtml}</div>
              <span class="match-pill">${entry.score}% match</span>
            </div>
            <div class="candidate-signatures">${signaturesHtml}</div>
            <div class="ida-prototypes">
              <div class="prototype-label">
                <svg viewBox="0 0 24 24" aria-hidden="true" class="kicker-icon">
                  <polyline points="9 6 4 12 9 18"/>
                  <polyline points="15 6 20 12 15 18"/>
                  <line x1="13" y1="4" x2="11" y2="20"/>
                </svg>
                IDA-compatible prototype
              </div>
              ${idaPrototypesHtml}
            </div>
          </div>
          <a class="doc-link" href="${escapeHtml(msdnUrl(entry))}" target="_blank" rel="noreferrer" title="Open the Microsoft Learn documentation for ${escapeHtml(entry.name)}">MSDN ↗</a>
        </div>
        <div class="evidence-list">${evidenceHtml}</div>
      `;
    } else {
      card.className = "candidate-row";
      card.dataset.resultIndex = String(index);
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-pressed", "false");
      card.setAttribute("aria-label", `Show details for ${entry.name}`);
      card.innerHTML = `
        <div class="candidate-row-main">
          <h3>${escapeHtml(entry.name)}</h3>
          <div class="compact-ida-prototype">${escapeHtml(formatCompactIdaPrototypes(entry))}</div>
        </div>
        <div class="compact-signature">${escapeHtml(formatCompactSignature(entry))}</div>
        <div class="score-bar" aria-hidden="true"><span style="--score-width: ${entry.score}%"></span></div>
        <div class="compact-score">${entry.score}%</div>
      `;
    }
    els.results.append(card);
  });
}

function copyIconSvg() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"></path></svg>';
}

function scoreColor(score) {
  if (score >= 80) return "#6d9b65";
  if (score >= 60) return "#d2a940";
  return "#c2613f";
}

function scoreBackground(score) {
  if (score >= 80) return "#dcebd8";
  if (score >= 60) return "#efe7c8";
  return "#f1d8ce";
}

function formatArgument(arg) {
  if (arg.unknown) return "unknown";
  if (arg.value === null) return "unparsed";
  return `${toHex(arg.value)} (${arg.value})`;
}

function displayArgValue(arg) {
  if (arg.unknown) return "?";
  if (arg.value === null) return arg.raw || "?";
  if (/^-?0x/i.test(arg.raw) || /h$/i.test(arg.raw)) return arg.raw;
  return String(arg.value);
}

function splitSignatureParam(signature) {
  const normalized = signature.replace(/\s+/g, " ").trim();
  const parts = normalized.split(" ");
  const name = parts.pop()?.replace(/^\*+/, "") || normalized;
  const type = parts.join(" ") || normalized;
  return { type, name };
}

function nameVariants(name) {
  if (name.endsWith("A/W")) {
    const base = name.slice(0, -3);
    return [`${base}A`, `${base}W`];
  }
  return [name];
}

function formatSignature(entry, displayName = entry.name) {
  return `${returnType(entry)} ${displayName}(${entry.signature.map((part) => formatSignatureType(splitSignatureParam(part).type, displayName)).join(", ")})`;
}

function formatCompactSignature(entry) {
  return `(${entry.signature.map((part) => splitSignatureParam(part).type).join(", ")})`;
}

function formatCompactIdaPrototypes(entry) {
  return nameVariants(entry.name).map((name) => formatIdaPrototype(entry, name)).join(" / ");
}

function formatIdaPrototype(entry, displayName = entry.name) {
  const storages = idaArgumentStorages(entry);
  const hasRegisterArgs = storages.some((storage) => storage && storage !== "stack");
  const convention = hasRegisterArgs
    ? `__userpurge *${displayName}@<${disassemblyAnalysis.returnStorage || "eax"}>`
    : `${defaultIdaCallingConvention(entry)} *${displayName}`;
  const params = entry.signature.map((part, index) => {
    const { type, name } = splitSignatureParam(part);
    const storage = hasRegisterArgs && storages[index] && storages[index] !== "stack" ? `@<${storages[index]}>` : "";
    return `${formatIdaType(type, displayName)} ${formatIdaParamName(name)}${storage}`;
  }).join(", ") || "void";
  return `${returnType(entry)} (${convention})(${params});`;
}

function idaArgumentStorages(entry) {
  if (!disassemblyAnalysis.fromPaste || disassemblyAnalysis.argStorages.length !== entry.params.length) {
    return [];
  }
  return disassemblyAnalysis.argStorages;
}

function defaultIdaCallingConvention() {
  return "__stdcall";
}

function formatIdaType(type, displayName) {
  return formatSignatureType(type, displayName)
    .replace(/\s+\*/g, " *")
    .replace(/\*\s+/g, "* ");
}

function formatIdaParamName(name) {
  return name.replace(/[^A-Za-z0-9_]/g, "") || "arg";
}

function formatSignatureType(type, displayName) {
  if (!entryHasTcharAlias(displayName)) return type;
  const wide = displayName.endsWith("W");
  const stringType = wide ? "LPCWSTR" : "LPCSTR";
  const mutableStringType = wide ? "LPWSTR" : "LPSTR";
  return type
    .replace(/\bLPCTSTR\b/g, stringType)
    .replace(/\bLPTSTR\b/g, mutableStringType)
    .replace(/\bPCTSTR\b/g, stringType)
    .replace(/\bPTSTR\b/g, mutableStringType)
    .replace(/\bLPCTSTR\s*\*/g, `${stringType} *`)
    .replace(/\bLPTSTR\s*\*/g, `${mutableStringType} *`);
}

function entryHasTcharAlias(displayName) {
  return /[AW]$/.test(displayName);
}

function returnType(entry) {
  if (/VirtualAlloc/i.test(entry.name)) return "LPVOID";
  if (/Create|Open|LoadLibrary|GetModuleHandle/i.test(entry.name)) return "HANDLE";
  if (/Nt|Zw/.test(entry.name)) return "NTSTATUS";
  if (/send|recv|connect|socket/i.test(entry.name)) return "int";
  return "BOOL";
}

function describeEvidence(item) {
  const { name } = splitSignatureParam(item.signature || `arg${item.index}`);
  const arg = item.arg;
  if (arg.unknown) return { main: `${name} = unknown`, note: "Ignored while ranking" };
  if (arg.value === 0) {
    if (item.kind === "bool") return { main: `${name} = FALSE`, note: item.note };
    return { main: `${name} = NULL`, note: name === "lpAddress" ? "Let the system choose the base address" : item.note };
  }
  if (item.kind === "size" && arg.value > 0) {
    const kb = arg.value / 1024;
    const sizeNote = kb >= 1 ? `≈ ${kb >= 10 ? Math.round(kb) : kb.toFixed(1)} KB region` : "size in bytes";
    return { main: `${name} = ${arg.value} bytes`, note: sizeNote };
  }
  const constantNote = item.note.split(",")[0];
  if (/[A-Z0-9_]+\s*(\||$)/.test(constantNote) && /[A-Z]/.test(constantNote)) {
    return { main: `${name} = ${constantNote}`, note: flagNamesFromValue(arg.value).join(" | ") || item.note };
  }
  return { main: `${name} = ${displayArgValue(arg)}`, note: item.note };
}

function flagNamesFromValue(value) {
  const matches = [];
  for (const group of Object.keys(FLAG_DEFS)) {
    const names = flagNames(group, value);
    if (names.length) matches.push(...names);
  }
  return [...new Set(matches)].slice(0, 4);
}

function msdnUrl(entryOrName) {
  const entry = typeof entryOrName === "string" ? { name: entryOrName, module: "", category: "", system: false } : entryOrName;
  const header = docsHeader(entry);
  const docsName = docsFunctionName(entry.name);
  if (!header) {
    return `https://learn.microsoft.com/search/?terms=${encodeURIComponent(docsName)}`;
  }
  return `https://learn.microsoft.com/en-us/windows/win32/api/${header}/nf-${header}-${docsName.toLowerCase()}`;
}

function docsHeader(entry) {
  const baseName = docsBaseName(entry.name);
  if (DOC_HEADER_OVERRIDES[baseName]) return DOC_HEADER_OVERRIDES[baseName];
  if (entry.system || entry.module === "ntdll") return "winternl";
  if (entry.module === "wininet") return "wininet";
  if (entry.module === "bcrypt") return "bcrypt";
  if (entry.module === "ws2_32") return "winsock2";
  if (entry.category === "Registry") return "winreg";
  if (entry.category === "Services") return "winsvc";
  if (entry.category === "Crypto") return "wincrypt";
  if (entry.category === "Memory") return "memoryapi";
  if (entry.category === "Sync") return "synchapi";
  if (entry.category === "Loader") return "libloaderapi";
  if (entry.category === "Files") return "fileapi";
  if (entry.category === "Handles") return "handleapi";
  if (entry.category === "Process" || entry.category === "Threads") return "processthreadsapi";
  return "";
}

function docsFunctionName(name) {
  if (name.endsWith("A/W")) return `${name.slice(0, -3)}A`;
  return name;
}

function docsBaseName(name) {
  if (name.endsWith("A/W")) return name.slice(0, -3);
  return name;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initFilters() {
  els.catalogMeta.textContent = `${CATALOG.length.toLocaleString()} functions indexed`;
}

function loadExample() {
  els.assemblyInput.value = `.text:0040146D                 push    40h ; '@'
.text:0040146F                 push    3000h
.text:00401474                 push    15400h
.text:00401479                 push    0
.text:0040147B                 call    [ebp+var_4C]`;
  parseAssembly();
}

async function copyQuery() {
  const payload = {
    args: currentValues,
    count: currentValues.length
  };
  try {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    return true;
  } catch {
    window.prompt("Current query", JSON.stringify(payload));
    return false;
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    window.prompt("Copy", text);
  }
}

function bindEvents() {
  els.paramCount.addEventListener("input", () => {
    const n = Math.max(0, Math.min(12, Math.floor(Number(els.paramCount.value)) || 0));
    currentCount = n;
    renderParamInputs();
    runSearch({ resetSelection: true });
  });
  els.paramCount.addEventListener("change", () => {
    setParamCount(currentCount);
  });
  els.countButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setParamCount(Number(button.dataset.count));
      renderParamInputs();
      runSearch({ resetSelection: true });
    });
  });
  els.matchBtn.addEventListener("click", () => runSearch({ resetSelection: true }));
  els.reverseArgs.addEventListener("click", () => {
    currentValues = [...currentValues].reverse();
    if (Array.isArray(disassemblyAnalysis.argStorages) && disassemblyAnalysis.argStorages.length) {
      disassemblyAnalysis.argStorages = [...disassemblyAnalysis.argStorages].reverse();
    }
    renderParamInputs();
    runSearch({ resetSelection: true });
  });
  els.clearArgs.addEventListener("click", () => {
    disassemblyAnalysis = { fromPaste: false, argStorages: [], returnStorage: "eax" };
    currentValues = currentValues.map(() => "");
    renderParamInputs();
    runSearch({ resetSelection: true });
  });
  els.manualTab.addEventListener("click", () => setMode("manual"));
  els.pasteTab.addEventListener("click", () => setMode("paste"));
  els.assemblyInput.addEventListener("input", parseAssembly);
  els.assemblyInput.addEventListener("paste", () => {
    setTimeout(() => {
      const next = els.assemblyInput.value.replace(/[ \t]{2,}/g, "  ");
      if (next !== els.assemblyInput.value) {
        els.assemblyInput.value = next;
        parseAssembly();
      }
    }, 0);
  });
  els.assemblyInput.addEventListener("scroll", () => {
    syncCodeScroll();
    updateOverflowState();
  });
  window.addEventListener("resize", updateOverflowState);
  els.results.addEventListener("click", (event) => {
    const button = event.target.closest("[data-copy]");
    if (button) {
      copyText(button.dataset.copy);
      return;
    }

    const row = event.target.closest(".candidate-row[data-result-index]");
    if (!row) return;
    const nextIndex = Number(row.dataset.resultIndex);
    const nextEntry = currentResults[nextIndex];
    if (!nextEntry) return;
    selectedResultName = nextEntry.name;
    renderResults(currentResults, nextIndex);
  });
  els.results.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const row = event.target.closest(".candidate-row[data-result-index]");
    if (!row) return;
    event.preventDefault();
    const nextIndex = Number(row.dataset.resultIndex);
    const nextEntry = currentResults[nextIndex];
    if (!nextEntry) return;
    selectedResultName = nextEntry.name;
    renderResults(currentResults, nextIndex);
  });
}

bindEvents();
renderParamInputs();
renderHighlight();
loadCatalog().then(() => {
  initFilters();
  if (!applyHashState()) runSearch();
});
