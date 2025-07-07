export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      checklist_templates: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          item_count: number
          sections: Json
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          item_count?: number
          sections?: Json
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          item_count?: number
          sections?: Json
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      completed_checklists: {
        Row: {
          completed_at: string | null
          completed_by: string
          equipment_id: string | null
          equipment_name: string
          id: string
          issues_count: number | null
          notes: string | null
          responses: Json
          status: string | null
          template_id: string | null
          template_name: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_by: string
          equipment_id?: string | null
          equipment_name: string
          id?: string
          issues_count?: number | null
          notes?: string | null
          responses?: Json
          status?: string | null
          template_id?: string | null
          template_name: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string
          equipment_id?: string | null
          equipment_name?: string
          id?: string
          issues_count?: number | null
          notes?: string | null
          responses?: Json
          status?: string | null
          template_id?: string | null
          template_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completed_checklists_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completed_checklists_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          created_at: string | null
          id: string
          last_inspection: string | null
          make_model: string
          next_inspection: string | null
          notes: string | null
          operator: string
          purchase_date: string | null
          safety_features: string[] | null
          status: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_inspection?: string | null
          make_model: string
          next_inspection?: string | null
          notes?: string | null
          operator: string
          purchase_date?: string | null
          safety_features?: string[] | null
          status?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_inspection?: string | null
          make_model?: string
          next_inspection?: string | null
          notes?: string | null
          operator?: string
          purchase_date?: string | null
          safety_features?: string[] | null
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      farm_maps: {
        Row: {
          background_image: Json | null
          bounds: Json | null
          config: Json | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          background_image?: Json | null
          bounds?: Json | null
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          background_image?: Json | null
          bounds?: Json | null
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      maintenance_tasks: {
        Row: {
          assigned_to: string
          completed_date: string | null
          created_at: string | null
          description: string | null
          due_date: string
          equipment: string
          equipment_id: string
          id: string
          priority: string
          status: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to: string
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          equipment: string
          equipment_id: string
          id?: string
          priority?: string
          status?: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          equipment?: string
          equipment_id?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          farm_name: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          farm_name?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          farm_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [        ]
      }
      risk_zones: {
        Row: {
          action_plan: Json | null
          category: string | null
          color: string | null
          created_at: string
          description: string | null
          farm_map_id: string
          geometry: Json | null
          id: string
          incidents_this_year: number | null
          is_active: boolean | null
          last_review: string | null
          location: string | null
          name: string
          opacity: number | null
          related_incident_ids: string[] | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_plan?: Json | null
          category?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          farm_map_id: string
          geometry?: Json | null
          id?: string
          incidents_this_year?: number | null
          is_active?: boolean | null
          last_review?: string | null
          location?: string | null
          name: string
          opacity?: number | null
          related_incident_ids?: string[] | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_plan?: Json | null
          category?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          farm_map_id?: string
          geometry?: Json | null
          id?: string
          incidents_this_year?: number | null
          is_active?: boolean | null
          last_review?: string | null
          location?: string | null
          name?: string
          opacity?: number | null
          related_incident_ids?: string[] | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_zones_farm_map_id_fkey"
            columns: ["farm_map_id"]
            isOneToOne: false
            referencedRelation: "farm_maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_zones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      risk_level: "Critical" | "High" | "Medium" | "Low"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      risk_level: ["Critical", "High", "Medium", "Low"],
    },
  },
} as const
